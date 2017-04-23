import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text
} from "react-native";

import {ListView} from "realm/react-native";
import Styles from "../../asset/style/custom";
import {capitalize} from "../shared/custom";

export default class Meaning extends Component {
  static navigationOptions = {
    title: ({state}) => capitalize(state.params.name),
    header: Header
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      wordObject: "",
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    const key = new Int8Array(64);
    const realm = new Realm({path: "vk.realm", encryptionKey: key});
    const {params} = this.props.navigation.state;
    let wordResult = realm.objects("Word").filtered("id = $0", params.id)[0];
    let exampleResult = realm.objects("Example").filtered("word_id = $0", params.id);
    this.setState({
      wordObject: wordResult,
      dataSource: this.state.dataSource.cloneWithRows(exampleResult)
    })
  }

  renderRow(data, sectionID, rowID) {
    return(
      <View>
        <Text style={[Styles.bigText, {color: "#000000"}]}>{`${rowID + 1}. ${capitalize(data.vn_example)}`}</Text>
        <Text style={[Styles.bigText, Styles.khExample]}>{data.kh_example}</Text>
      </View>
    )
  }

  renderTechnicalLabel(wordType) {
    if(wordType === "technical") {
      return(
        <Text style={[Styles.smallText, {marginBottom: 10}]}>(ពាក្យបច្ចេកទេស)</Text>
      )
    } else {
      return(null)
    }
  }

  renderExampleLabel() {
    if(this.state.dataSource.getRowCount() > 0) {
      return(
        <View>
          <Text style={[Styles.bigText, Styles.exampleLabel]}>ឧទាហរណ៍</Text>
        </View>
      )
    } else {
      return(null)
    }
  }

  render() {
    return(
      <ScrollView style={Styles.containerMeaning}>
        {this.renderTechnicalLabel(this.state.wordObject.word_type)}
        <Text style={[Styles.bigText, Styles.meaningText]}>{this.state.wordObject.meaning}</Text>
        {this.renderExampleLabel()}
        <ListView style={Styles.exampleList}
          dataSource={this.state.dataSource}
          renderRow={(data, sectionID, rowID) => this.renderRow(data, sectionID, rowID)}
          enableEmptySections={true}
        />
      </ScrollView>
    )
  }
}
