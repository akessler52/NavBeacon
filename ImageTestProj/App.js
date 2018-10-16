import React from 'react';
import { StyleSheet, Text, View, AppRegistry, Image } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.canvas}
          source={require('/Users/ryanhamilton/Documents/GitHub/NavBeacon/ImageTestProj/1stFloorPlan.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
