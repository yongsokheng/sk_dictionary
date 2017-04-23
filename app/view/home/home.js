import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  Button,
  TextInput,
  TouchableHighlight,
  StatusBar
} from "react-native";

import {ListView} from "realm/react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Styles from "../../asset/style/custom";
import NativeStyles from "../../asset/style/styles";
import Loading from "./loading";
import Header from "../shared/header";
import realm from "../shared/realm";
import {capitalize} from "../shared/custom";
import SplashScreen from "react-native-splash-screen";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "វចនានុក្រម VK",
    header: Header
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      realmVersion: realm.objects("Version").length,
      vkData: ""
    };
  }

  setData() {
    const key = new Int8Array(64);
    let vkData = new Realm({path: "vk.realm", encryptionKey: key}).objects("Word").sorted("name");
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(vkData),
      realmVersion: realm.objects("Version").length,
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
    SplashScreen.hide();
  }

  renderTechnicalLabel(wordType) {
    if(wordType === "technical") {
      return(
        <Text style={Styles.smallText}>  (ពាក្យបច្ចេកទេស)</Text>
      )
    } else {
      return(null)
    }
  }

  rowClick(data) {
    this.props.navigation.navigate("Meaning", {id: data.id, name: data.name});
  }

  renderRow(data) {
    return(
      <TouchableHighlight
        onPress={() => this.rowClick(data)}
        underlayColor = {"#dddddd"} >
        <View style={Styles.rowContainer}>
          <Text style={[Styles.bigText, {color: "#000000"}]}>{capitalize(data.name)}</Text>
          {this.renderTechnicalLabel(data.word_type)}
        </View>
      </TouchableHighlight>
    )
  }

  searchText(text) {
    let result = this.state.vkData.filtered("name BEGINSWITH[c] $0 OR raw_name BEGINSWITH[c] $1", text, text).sorted("name");
    if((list = this.refs.list)) {
      list.scrollTo({y: 0, animated: false});
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result)
    });
  }

  renderResultList() {
    if(this.state.dataSource.getRowCount() > 0) {
      return(
        <ListView dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          enableEmptySections={true}
          pageSize={2}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={Styles.separator} />}
          keyboardShouldPersistTaps={"always"}
          ref="list"
          style={Styles.list} />
      )
    } else {
      return(
        <View style={Styles.middleText}>
          <Text style={[Styles.bigText, {color: "#000000"}]}>គ្មានទិន្នន័យ</Text>
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
          <TextInput style={[NativeStyles.textInput, Styles.bigText]}
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
      <View style={Styles.container}>
        <StatusBar barStyle="light-content" />
        {this.renderUi()}
      </View>
    );
  }
}
