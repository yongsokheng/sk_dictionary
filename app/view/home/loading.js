import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import Styles from "../../asset/style/custom";

export default class Loading extends Component {
  render() {
    return(
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
