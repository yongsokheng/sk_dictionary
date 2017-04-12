import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight
} from "react-native";


import {ListView} from "realm/react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Styles from "../../asset/style/custom";
import Loading from "./loading";
import Header from "../shared/header";
import realm from "../shared/realm";

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
      realmVersion: realm.objects("Version").length,
      resultCount: 1, // 1 represent for result > 0
      vkData: ""
    };
  }

  setData() {
    const key = new Int8Array(64);
    let vkData = new Realm({path: "vk.realm", encryptionKey: key}).objects("Word");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(vkData),
      realmVersion: realm.objects("Version").length,
      resultCount: 1,
      vkData: vkData
    });
  }

  componentDidMount() {
    let self = this;
    if(this.state.realmVersion <= 0) {
      let promise = new Promise((resolve, reject) => {
        setTimeout(function() {
          Realm.copyBundledRealmFiles();

          realm.write(() => {
            realm.create("Version", {id: 1});
          });

          resolve("success");
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
    let result = this.state.vkData.filtered("name BEGINSWITH[c] $0 OR raw_name BEGINSWITH[c] $1", text, text);
    if((list = this.refs.list)) {
      list.scrollTo({y: 0, animated: false});
    }
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
          ref="list"
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
    if(this.state.realmVersion <= 0) {
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
