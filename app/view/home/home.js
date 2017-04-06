import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight
} from 'react-native';

const wordData = require("../../data/word");
const exampleData = require("../../data/example");

import {ListView} from "realm/react-native";
import realm from "../../data/realm";
import Icon from 'react-native-vector-icons/FontAwesome';
import Styles from "../../asset/style/custom";
import Loading from "./loading";
import Header from "../shared/header";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "VK Dictionary",
    header: Header
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      wordObjects: realm.objects("Word"),
      result: realm.objects("Word").length
    };
  }

  setData() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(realm.objects("Word")),
      wordObjects: realm.objects("Word"),
      result: realm.objects("Word").length
    });
  }

  componentDidMount() {
    let self = this;
    if(this.state.wordObjects.length <= 0) {
      let promise = new Promise((resolve, reject) => {
        setTimeout(function() {
          realm.write(() => {
            for(let [key, value] of Object.entries(wordData)) {
              realm.create('Word', {id: value.id, name: value.name,
                raw_name: value.raw_name, meaning: value.meaning,
                word_type: value.word_type});
            }

            for(let [key, value] of Object.entries(exampleData)) {
              realm.create('Example', {id: value.id, vn_example: value.vn_example,
                kh_example: value.kh_example, word_id: value.word_id});
            }
          });

          if(realm.objects("Word").length == 25709 && realm.objects("Example").length == 11790) {
            resolve("Success!");
          } else {
            reject("something went wrong");
          }
        }, 250);
      });

      promise.then(function(result) {
        self.setData();
      }, function(err) {
        console.log(err);
      });

    } else {
      this.setData();
    }
  }

  renderRow(data) {
    return(
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate("Meaning", {id: data.id, name: data.name})}>
        <Text>{data.name}</Text>
      </TouchableHighlight>
    )
  }

  searchText(text) {
    let result = this.state.wordObjects.filtered(`name BEGINSWITH[c] "${text.toLowerCase()}" OR raw_name BEGINSWITH[c] "${text.toLowerCase()}"`);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result),
      result: result.length
    });
  }

  renderResultList() {
    if(this.state.result <= 0) {
      return(
        <View style={Styles.middleText}>
          <Text>No result found</Text>
        </View>
      )
    } else {
      return(
        <ListView dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          enableEmptySections={true}
          style={Styles.list} />
      )
    }
  }

  renderUi() {
    if(this.state.wordObjects.length <= 0) {
      return(<Loading />)
    } else {
      return(
        <View style={Styles.container}>
          <TextInput style={Styles.textInput}
            placeholder="ស្វែងរកពាក្យ ..."
            onChangeText={(text) => this.searchText(text)}
          />
          {this.renderResultList()}
        </View>
      )
    }
  }

  render() {
    return (
      <View style={Styles.container}>{this.renderUi()}</View>
    );
  }
}
