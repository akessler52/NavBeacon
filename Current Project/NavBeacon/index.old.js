 'use strict';

import React, {
   Component
 }                             from 'react';
import {
   AppRegistry,
   StyleSheet,
   View,
   Text,
   ListView,
   DeviceEventEmitter
 }                            from 'react-native';
import Beacons                from 'react-native-beacons-manager';
import BluetoothState         from 'react-native-bluetooth-state';
import MapTiles               from './MapTiles.js'
//import BeaconsFinder          from './BeaconsLocationClass.js'
var minor;
 class reactNativeBeaconExample extends Component {
   constructor(props) {
     super(props);
     // Create our dataSource which will be displayed in the ListView
     var closeBeacon;
     var ds = new ListView.DataSource({
       rowHasChanged: (r1, r2) => r1 !== r2 }
     );
     this.state = {
       bluetoothState: '',
       // region information
       identifier: 'Kontakt.io',
       uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
       // React Native ListView datasource initialization
       dataSource: ds.cloneWithRows([]),
       //closeBeacon: 0
     };
   }

   componentWillMount(){
     //
     // ONLY non component state aware here in componentWillMount
     //
     // Request for authorization while the app is open
     Beacons.requestWhenInUseAuthorization();
     // Define a region which can be identifier + uuid,
     // identifier + uuid + major or identifier + uuid + major + minor
     // (minor and major properties are numbers)
     const region = {
       identifier: this.state.identifier,
       uuid: this.state.uuid
     };
     // Range for beacons inside the region
     Beacons.startRangingBeaconsInRegion(region);
     Beacons.startUpdatingLocation();
   }

   componentDidMount() {
     //
     // component state aware here - attach events
     //
     // Ranging: Listen for beacon changes
     this.beaconsDidRange = DeviceEventEmitter.addListener(
       'beaconsDidRange',
       (data) => {
         var closestBeacon = null;
         for (var beacon in data.beacons) {
           if (beacon.rssi < 0 && closestBeacon != null && beacon.rssi > closestBeacon.rssi) {
             closestBeacon = beacon;
           }
         }
         this.closeBeacon = closestBeacon.minors;
         // this.setState({
         //   dataSource: this.state.dataSource.cloneWithRows(data.beacons)
         // });
       }
     );

     // listen bluetooth state change event
     BluetoothState.subscribe(
       bluetoothState => {
         this.setState({ bluetoothState: bluetoothState });
       }
     );
     BluetoothState.initialize();
   }

   componentWillUnMount(){
     this.beaconsDidRange = null;
   }

   render() {
     const { bluetoothState, dataSource, closeBeacon } =  this.state;
     return (
       <View style={styles.container}>
        <Text>
          Minor Value: { closeBeacon }
        </Text>
       </View>
     );
   }

   renderRow = rowData => {
     return (
        <View style={styles.row}>
          <Text style={styles.smallText}>
            UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
          </Text>
          <Text style={styles.smallText}>
            Major: {rowData.major ? rowData.major : 'NA'}
          </Text>
          <Text style={styles.smallText}>
            Minor: {rowData.minor ? rowData.minor : 'NA'}
          </Text>
          <Text>
           RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
         </Text>
         <Text>
           Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
         </Text>
         <Text>
           Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
         </Text>
       </View>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     paddingTop: 60,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   btleConnectionStatus: {
     fontSize: 20,
     paddingTop: 20
   },
   headline: {
     fontSize: 20,
     paddingTop: 20
   },
   row: {
     padding: 8,
     paddingBottom: 16
   },
     smallText: {
     fontSize: 11
   }
 });


 AppRegistry.registerComponent(
   'reactNativeBeaconExample',
   () => reactNativeBeaconExample
 );
