import React, { Component } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';

import MapTiles from './MapTiles'; //Import Class for MapTiles
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Beacons from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state'
import { hashCode, deepCopyBeaconsLists } from './helpers'; //Helper file for the Beacons
import moment from 'moment';

const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <MapTiles />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
