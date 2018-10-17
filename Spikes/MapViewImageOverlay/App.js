import React from 'react';
import { StyleSheet, Text, View, Button, Alert,  } from 'react-native';
import { MapView } from "expo";


export default class App extends React.Component {
  render() {
    return (
        <MapView
            style={{
                flex: 1
            }}
            provider="google"
            initialRegion={{
                latitude: 42.254062,
                longitude: -85.64073,
                latitudeDelta: .005,
                longitudeDelta: .002
            }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
