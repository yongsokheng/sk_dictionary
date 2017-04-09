import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight
} from "react-native";

const wordData = require("../../data/word");
const exampleData = require("../../data/example");

import {ListView} from "realm/react-native";
import realm from "../../data/realm";
import Icon from "react-native-vector-icons/FontAwesome";
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
    const wordObjects = realm.objects("Word");
    this.state = {
      dataSource: ds.cloneWithRows([]),
      schemaExistLength: wordObjects.length,
      resultCount: wordObjects.length
    };
  }

  setData() {
    const wordObjects = realm.objects("Word");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(wordObjects),
      schemaExistLength: wordObjects.length,
      resultCount: wordObjects.length
    });
  }

  componentDidMount() {
    let self = this;
    console.log(Realm.defaultPath);
    if(this.state.schemaExistLength <= 0) {
      let promise = new Promise((resolve, reject) => {
        setTimeout(function() {
          realm.write(() => {
            for(let [key, value] of Object.entries(wordData)) {
              realm.create("Word", {id: value.id, name: value.name,
                raw_name: value.raw_name, meaning: value.meaning,
                word_type: value.word_type});
            }

            for(let [key, value] of Object.entries(exampleData)) {
              realm.create("Example", {id: value.id, vn_example: value.vn_example,
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
    let result = realm.objects("Word").filtered("name BEGINSWITH[c] $0 OR raw_name BEGINSWITH[c] $1", text, text);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result),
      resultCount: result.length
    });
  }

  renderResultList() {
    if(this.state.resultCount) {
      return(
        <ListView dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          enableEmptySections={true}
          pageSize={2}
          style={Styles.list} />
      )
    } else {
      return(
        <View style={Styles.middleText}>
          <Text>No result found</Text>
        </View>
      )
    }
  }

  renderUi() {
    if(this.state.schemaExistLength <= 0) {
      return(<Loading />)
    } else {
      return(
        <View style={Styles.container}>
          <TextInput style={Styles.textInput}
            placeholder="ស្វែងរកពាក្យ ..."
            onChangeText={(text) => this.searchText(text.trim().toLowerCase())}
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
