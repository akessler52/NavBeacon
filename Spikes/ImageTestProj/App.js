import React from 'react';
import { StyleSheet, Text, View, AppRegistry, Image } from 'react-native';


export default class App extends React.Component {
  /*getCoords(event)
  {
    let rect= event.getClientBoundingRect();
    let mouses = {
      x: event.clientX,
      y: event.clientY
    }

    console.log(rect,mouses);
  }*/
  render() {
    return (
      <View>
        <Image
          //style={styles.canvas}
          onMouseOver={this.getCoords.bind(this)}
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
  /*canvas: {
   position: 'relative',
   width: '100%',
   height: 'auto',
   top: 0,
   left: 0,
   bottom: 0,
   right: 0,
 },*/
});
