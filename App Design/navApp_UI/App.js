import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { MapView } from 'expo';
import { DrawerNavigator, DrawerItems, SafeAreaView, NavgationActions, DrawerActions } from 'react-navigation';
// import {
//   Menu,
//   MenuOptions,
//   MenuOption,
//   MenuTrigger,
// } from 'react-native-popup-menu';

export default class App extends React.Component {

    floor() {
        Alert.alert('we can change what this does l8r');
    }

    menu() {

    }

render() {
  return (
      <View style={styles.container}>
          <MapView
          style={styles.map}
          provider="google"
          initialRegion={{
              latitude: 42.254037,
              longitude: -85.640705,
              latitudeDelta: 0.007,
              longitudeDelta: 0.003,
          }}
          />
          <View style={styles.buttonContainerBR}>
              <TouchableOpacity
                  onPress={() => this.floor()}
                  style={styles.button}
                  >
                  <Text>floor</Text>
              </TouchableOpacity>
          </View>

           <View style={styles.buttonContainerTL}>
               <TouchableOpacity
                   onPress={() => this.menu()}
                   style={styles.button2}
                   >
                  <Image
                    style={styles.button2}
                    source={require('./menu.png')}
                  />
               </TouchableOpacity>
           </View>


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
  },
  bubble: {
      flex: 1,
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
  },
  button: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: 'rgba(0,125,255,0.7)',
  },
  button2: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.01)',
      width: 45,
      height: 45,
  },
  buttonContainerBR: {
      flex:1,
      position: 'absolute',
      right: 22,
      bottom: 12,
  },
  buttonContainerTL: {
      flex:1,
      position: 'absolute',
      left: 22,
      top: 44,
  },
  menu: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: 'rgba(220,220,220,0.9)',
  },
  menuText: {
      fontSize: 20
  },
  icon: {
    width: 24,
    height: 24,
  },
});
