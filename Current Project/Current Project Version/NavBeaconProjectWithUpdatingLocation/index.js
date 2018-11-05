// @flow

// #region imports
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, ListView, DeviceEventEmitter, Dimensions } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state';
import moment from 'moment';
import { hashCode, deepCopyBeaconsLists } from './helpers';

//New MapTiles Import
import MapView, { MAP_TYPES, PROVIDER_GOOGLE, ProviderPropType, UrlTile, Marker,Polyline } from 'react-native-maps';
const { width, height } = Dimensions.get('window');

//MapTiles Lat and Long
const ASPECT_RATIO = width / height;
const LATITUDE = 42.254254;
const LONGITUDE = -85.640700;
const LATITUDE_DELTA = 0.0052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//List Of Beacons With Corresponding Latitude/Longitude and floor number
var BeaconsLocList = [
  {Minor: 1, Major: 0, Lat: 42.252836, Long: -85.641453, KontaktID: "pM83", Floor: 2, Distance: 0},
  {Minor: 2, Major: 0, Lat: 42.252885, Long: -85.641588, KontaktID: "7jSV", Floor: 2, Distance: 0},
  {Minor: 3, Major: 0, Lat: 42.25295, Long: -85.641547, KontaktID: "GUqH", Floor: 2, Distance: 0},
  {Minor: 4, Major: 0, Lat: 42.253015, Long: -85.641506, KontaktID: "uBAv", Floor: 2, Distance: 0},
  {Minor: 5, Major: 0, Lat: 42.25308, Long: -85.641465, KontaktID: "dwva", Floor: 2, Distance: 0},
  {Minor: 6, Major: 0, Lat: 42.253145, Long: -85.641424, KontaktID: "b3Ay", Floor: 2, Distance: 0},
  {Minor: 7, Major: 0, Lat: 42.25321, Long: -85.641383, KontaktID: "sK5Q", Floor: 2, Distance: 0},
  {Minor: 8, Major: 0, Lat: 42.253275, Long: -85.641342, KontaktID: "7oXx", Floor: 2, Distance: 0},
  {Minor: 9, Major: 0, Lat: 42.25334, Long: -85.641301, KontaktID: "Fma5", Floor: 2, Distance: 0},
  {Minor: 10, Major: 0, Lat: 42.253405, Long: -85.64126, KontaktID: "vRWR", Floor: 2, Distance: 0},
  {Minor: 11, Major: 0, Lat: 42.25347, Long: -85.641219, KontaktID: "GEWh", Floor: 2, Distance: 0},
  {Minor: 12, Major: 0, Lat: 42.253535, Long: -85.641178, KontaktID: "0dms", Floor: 2, Distance: 0},
];
// #endregion

// #region flow types
type DetectedBeacon = {
  identifier: string,
  uuid?: string,
  major?: number,
  minor?: number,
  proximity?: string,
  rssi?: string,
  distance?: number,
};

type Section = {
  key: number,
  data: Array<DetectedBeacon>,
  title: string,
  sectionId: string,
};

type Props = any;

type State = {
  // region information
  uuid?: string,
  identifier: string,
  // all detected beacons:
  beacons: Array<Section>,
};
// #endregion

// #region constants
// uuid of YOUR BEACON (change to yours)
const UUID = 'f7826da6-4fa2-4e98-8024-bc5b71e0893e';
const IDENTIFIER = 'Kontakt.io';
const TIME_FORMAT = 'HH:mm:ss';
const EMPTY_BEACONS_LISTS = {
  rangingList: [],
  monitorEnterList: [],
  monitorExitList: [],
};

// #endregion

class reactNativeBeaconExample extends Component<Props, State> {
  //Map Tiles Constructor
  constructor(props, context) {
    super(props, context);

    this.mapState = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
        marker: null,
    };
  }
  // will be set as list of beacons to update state
  _beaconsLists = null;

  // will be set as a reference to "beaconsDidRange" event:
  beaconsDidRangeEvent = null;
  // will be set as a reference to "regionDidEnter" event:
  regionDidEnterEvent = null;
  // will be set as a reference to "regionDidExit" event:
  regionDidExitEvent = null;
  // will be set as a reference to "authorizationStatusDidChange" event:
  authStateDidRangeEvent = null;

  state = {
    // region information
    uuid: UUID,
    identifier: IDENTIFIER,

    // check bluetooth state:
    bluetoothState: '',

    message: '',

    beaconsLists: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }).cloneWithRowsAndSections(EMPTY_BEACONS_LISTS),

    beaconsArr: [],
    polyLinePath: []
  };

  componentWillMount() {
    this._beaconsLists = EMPTY_BEACONS_LISTS;
    const { identifier, uuid } = this.state;

    // MANDATORY: you have to request ALWAYS Authorization (not only when in use) when monitoring
    // you also have to add "Privacy - Location Always Usage Description" in your "Info.plist" file
    // otherwise monitoring won't work
    Beacons.requestAlwaysAuthorization();
    Beacons.shouldDropEmptyRanges(true);
    // Define a region which can be identifier + uuid,
    // identifier + uuid + major or identifier + uuid + major + minor
    // (minor and major properties are numbers)
    const region = { identifier, uuid };
    // Monitor for beacons inside the region
    Beacons.startMonitoringForRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons monitoring started succesfully'))
      .catch(error =>
        console.log(`Beacons monitoring not started, error: ${error}`),
      );

    // Range for beacons inside the region
    Beacons.startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
      .then(() => console.log('Beacons ranging started succesfully'))
      .catch(error =>
        console.log(`Beacons ranging not started, error: ${error}`),
      );

    // update location to be able to monitor:
    Beacons.startUpdatingLocation();
  }

  componentDidMount() {
    // OPTIONAL: listen to authorization change
    this.authStateDidRangeEvent = DeviceEventEmitter.addListener(
      'authorizationStatusDidChange',
      info => console.log('authorizationStatusDidChange: ', info),
    );

    // Ranging: Listen for beacon changes
    this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      data => {
        this.setState({ message: 'beaconsDidRange event' });
        // console.log('beaconsDidRange, data: ', data);
        const updatedBeaconsLists = this.updateBeaconList(
          data.beacons,
          'rangingList',
        );
        this._beaconsLists = updatedBeaconsLists;
        this.setState({
          beaconsLists: this.state.beaconsLists.cloneWithRowsAndSections(
            this._beaconsLists,
          ),
        });
      },
    );

    // // Ranging: Listen for beacon changes
    // this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
    //   'beaconsDidRange',
    //   ({region: {identifier, uuid}, beacons}) => {
    //     // do here anything you need (ex: setting state...)
    //     const Beacons = this.updateBeaconList(beacons);
    //     //this.state.beaconsArr = Beacons['rangingList']; //This will pass just the list itself without the rangingList tag
    //     minorVal = Beacons['rangingList'][0].minor;
    //     console.log('beaconsDidRange these beacons: ', Beacons['rangingList']);
    //     //To Reference Beacons:
    //     //Beacons['rangingList'][index].variableNeeded
    //   }
    // );

    // Ranging: Listen for beacon changes
    this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      ({region: {identifier, uuid}, beacons}) => {
        const Beacons = this.updateBeaconList(beacons);
        this.setState({ beaconsArr: Beacons['rangingList'] });
        //this.state.beaconsArr = Beacons['rangingList'];
        // do here anything you need (ex: setting state...)
        //console.log('beaconsDidRange these beacons: ', this.state.beaconsArr);
        //To Reference Beacons:
        //Beacons['rangingList'][index].variableNeeded
      }
    );

    // monitoring events
    this.regionDidEnterEvent = DeviceEventEmitter.addListener(
      'regionDidEnter',
      ({ uuid, identifier }) => {
        this.setState({ message: 'regionDidEnter event' });
        //console.log('regionDidEnter, data: ', { uuid, identifier });
        const time = moment().format(TIME_FORMAT);
        const updatedBeaconsLists = this.updateBeaconList(
          { uuid, identifier, time },
          'monitorEnterList',
        );
        this._beaconsLists = updatedBeaconsLists;
        this.setState({
          beaconsLists: this.state.beaconsLists.cloneWithRowsAndSections(
            this._beaconsLists,
          ),
        });
      },
    );

    this.regionDidExitEvent = DeviceEventEmitter.addListener(
      'regionDidExit',
      ({ identifier, uuid, minor, major }) => {
        this.setState({ message: 'regionDidExit event' });
        /*console.log('regionDidExit, data: ', {
          identifier,
          uuid,
          minor,
          major,
        });*/
        const time = moment().format(TIME_FORMAT);
        const updatedBeaconsLists = this.updateBeaconList(
          { identifier, uuid, minor, major, time },
          'monitorExitList',
        );
        this._beaconsLists = updatedBeaconsLists;
        this.setState({
          beaconsLists: this.state.beaconsLists.cloneWithRowsAndSections(
            this._beaconsLists,
          ),
        });
      },
    );
    // listen bluetooth state change event
    BluetoothState.subscribe(bluetoothState =>
      this.setState({ bluetoothState: bluetoothState }),
    );
    BluetoothState.initialize();
  }

  componentWillUnMount() {
    const { uuid, identifier } = this.state;

    const region = { identifier, uuid }; // minor and major are null here

    // stop monitoring beacons:
    Beacons.stopMonitoringForRegion(region)
      .then(() => console.log('Beacons monitoring stopped succesfully'))
      .catch(error =>
        console.log(`Beacons monitoring not stopped, error: ${error}`),
      );

    // stop ranging beacons:
    Beacons.stopRangingBeaconsInRegion(region)
      .then(() => console.log('Beacons ranging stopped succesfully'))
      .catch(error =>
        console.log(`Beacons ranging not stopped, error: ${error}`),
      );

    // stop updating locationManager:
    Beacons.stopUpdatingLocation();
    // remove auth state event we registered at componentDidMount:
    this.authStateDidRangeEvent.remove();
    // remove monitiring events we registered at componentDidMount::
    this.regionDidEnterEvent.remove();
    this.regionDidExitEvent.remove();
    // remove ranging event we registered at componentDidMount:
    this.beaconsDidRangeEvent.remove();
  }

//Searches through the beacons list and returns the Beacon Object with Lat and Long
  setMarkerToPosition() {

    var BeaconToReturn = [];
    BeaconToReturn = this.findBeaconsClosest();

    if(BeaconToReturn.length == 0)
    {
      var NewMarker = Marker.coordinate = null;
    }
    else {
      //console.log("ELSE: ", BeaconArray[0]);
      //BeaconToReturn = this.findBeaconsClosest();
      var NewMarker = Marker.coordinate = {
        latitude: BeaconToReturn[0].Lat, //May need to be BeaconToReturn["Lat"]
        longitude: BeaconToReturn[0].Long, //May need to be BeaconToReturn["Long"]
      };
    }
    /* For Reference LatLong is a Marker Type
      type LatLng {
      latitude:
      longtiude:
    }
    */
    return NewMarker;

  };

  findBeaconsClosest() {
    var i=0;
    var BeaconToReturn = [];

    if(this.state.beaconsArr === undefined || this.state.beaconsArr.length == 0)
    {//If the Array is undefined or length is 0 return NULL handle this in the coordinate marker call
      BeaconToReturn = [];
    }
    else
    {
      do{
          BeaconToReturn[0] = BeaconsLocList[this.state.beaconsArr[i].minor-1];
          BeaconToReturn[0].Distance = this.state.beaconsArr[i].accuracy;
          console.log("Beacon Array position",i);
          if(i < this.state.beaconsArr.length-1)
          {
            BeaconToReturn[1] = BeaconsLocList[this.state.beaconsArr[i+1].minor-1];
            BeaconToReturn[1].Distance = this.state.beaconsArr[i+1].accuracy;
          }

      }while(this.state.beaconsArr[i++].accuracy < 0 && i < this.state.beaconsArr.length-1);
      console.log("BeaconToReturn", BeaconToReturn);
    }

    return BeaconToReturn;
  }

  createPathArray() {
    var i;
    var coordinate = new Object();

    for(i=0;i < BeaconsLocList.length; i++)
    {
      coordinate = {latitude: BeaconsLocList[i].Lat, longitude: BeaconsLocList[i].Long}
      //console.log("Coordinate Object: ",coordinate);
      this.state.polyLinePath.push(coordinate);
    }

  };

  createPath() {
    var userPathArr = [];

    var BeaconToReturn1 = this.findBeaconsClosest();
    //BeaconToReturn2 = this.findBeaconsClosest();
    if(BeaconToReturn1.length == 0)
    {
      userPathArr = [];
    }
    else
    {
      userPathArr = this.state.polyLinePath.slice([BeaconToReturn1[0].Minor-1],this.state.polyLinePath.length);
    }

    return userPathArr;
  }

  render() {
    const { bluetoothState, beaconsLists, message} = this.state;
    this.createPathArray();
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          mapType={this.mapType}
          style={styles.map}
          initialRegion={this.mapState.region}
        >
          <UrlTile
            urlTemplate="file:///./assests/MapFiles/{z}/{x}/{y}.png"
            zIndex={-1}
          />
          <Marker
            /*title={marker.key}
            image={flagPinkImg}
            key={marker.key}*/
            coordinate = {this.setMarkerToPosition()}
          />
          <Polyline
        		coordinates= {this.state.polyLinePath}
        		strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        		strokeWidth={6}
	      />
        </MapView>
      </View>
    );
  }

  renderBeaconRow = rowData => (
    <View style={styles.row}>
      <Text style={styles.smallText}>
        Identifier: {rowData.identifier ? rowData.identifier : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        UUID: {rowData.uuid ? rowData.uuid : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        Major: {rowData.major ? rowData.major : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        Minor: {rowData.minor ? rowData.minor : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        time: {rowData.time ? rowData.time : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
      </Text>
      <Text style={styles.smallText}>
        Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
      </Text>
    </View>
  );

  renderBeaconSectionHeader = (sectionData, header) => (
    <Text style={styles.rowSection}>{header}</Text>
  );

  updateBeaconList = (detectedBeacons = [], listName = '') => {
    // just a deep copy of "this._beaconsLists":
    const previousLists = deepCopyBeaconsLists(this._beaconsLists);
    const listNameIsValid = Object.keys(EMPTY_BEACONS_LISTS).some(
      header => header === listName,
    );
    const updateMatchingList = beacon => {
      if (beacon.uuid.length > 0) {
        const uuid = beacon.uuid.toUpperCase();
        const major = parseInt(beacon.major, 10) ? beacon.major : 0;
        const minor = parseInt(beacon.minor, 10) ? beacon.minor : 0;

        const hasEqualProp = (left, right) =>
          String(left).toUpperCase() === String(right).toUpperCase();
        const isNotTheSameBeacon = beaconDetail => {
          return (
            !hasEqualProp(beaconDetail.uuid, uuid) ||
            !hasEqualProp(beaconDetail.major, major) ||
            !hasEqualProp(beaconDetail.minor, minor)
          );
        };

        const otherBeaconsInSameList = previousLists[listName].filter(
          isNotTheSameBeacon,
        );
        previousLists[listName] = [...otherBeaconsInSameList, beacon];
      }
    };

    if (!listNameIsValid) {
      return previousLists;
    }

    if (!Array.isArray(detectedBeacons)) {
      if (detectedBeacons instanceof Object) {
        updateMatchingList(detectedBeacons);
        return previousLists;
      } else {
        return previousLists;
      }
    }

    detectedBeacons.forEach(updateMatchingList);
    return previousLists;
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  justFlex: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btleConnectionStatus: {
    fontSize: 20,
    paddingTop: 20,
  },
  headline: {
    fontSize: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  row: {
    padding: 8,
    paddingBottom: 16,
  },
  smallText: {
    fontSize: 11,
  },
  rowSection: {
    fontWeight: '700',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
});

AppRegistry.registerComponent('reactNativeBeaconExample',() => reactNativeBeaconExample);
