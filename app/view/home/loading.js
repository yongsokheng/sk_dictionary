import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import Styles from "../../asset/style/custom";

export default class Loading extends Component {
  render() {
    return(
      <View style={Styles.middleText}>
        <ActivityIndicator size="large" />
        <Text style={[Styles.bigText, {marginTop: 10}]}>កំពុងរៀបចំទិន្នន័យ ...</Text>
      </View>
    )
  }
}
