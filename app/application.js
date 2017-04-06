import {
  AppRegistry,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

import HomeScreen from "./view/home/home";
import MeaningScreen from "./view/meaning";

const Application = StackNavigator({
  Home: {screen: HomeScreen},
  Meaning: {screen: MeaningScreen}
});

AppRegistry.registerComponent('vk_dictionary', () => Application);
