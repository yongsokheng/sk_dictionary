import React, { Component } from "react";
import {
  View,
  Text
} from "react-native";

import {ListView} from "realm/react-native";
import styles from "../../asset/style/custom";
import realm from "../../data/realm";

export default class Meaning extends Component {
  static navigationOptions = {
    title: ({state}) => state.params.name,
    header: Header
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      word: "",
      meaning: "",
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    const {params} = this.props.navigation.state;
    let wordResult = realm.objects("Word").filtered("id = $0", params.id)[0];
    let exampleResult = realm.objects("Example").filtered("word_id = $0", params.id);
    this.setState({
      word: wordResult.name,
      meaning: wordResult.meaning,
      dataSource: this.state.dataSource.cloneWithRows(exampleResult)
    })
  }

  renderRow(data, sectionID, rowID) {
    return(
      <View>
        <Text>{`${rowID + 1}. ${data.vn_example}`}</Text>
        <Text>{data.kh_example}</Text>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>{this.state.word}</Text>
        <Text>{this.state.meaning}</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data, sectionID, rowID) => this.renderRow(data, sectionID, rowID)}
          enableEmptySections={true}
        />
      </View>
    )
  }
}
