// @flow

// #region imports
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, ListView, DeviceEventEmitter, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { SearchBar, List, ListItem } from 'react-native-elements';
import Beacons from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state';
import moment from 'moment';
import { hashCode, deepCopyBeaconsLists } from './helpers';

//New MapTiles Import
import MapView, { MAP_TYPES, PROVIDER_GOOGLE, ProviderPropType, UrlTile, Marker,Polyline } from 'react-native-maps';
const { width, height } = Dimensions.get('window');
//import positionMarker from './position.png'
//MapTiles Lat and Long
const ASPECT_RATIO = width / height;
const LATITUDE = 42.254254;
const LONGITUDE = -85.640700;
const LATITUDE_DELTA = 0.00023;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//List Of Beacons With Corresponding Latitude/Longitude and floor number
var BeaconsLocList = [
  {Minor: 1, Major: 0, Lat: 42.25285589, Long: -85.6415303, KontaktID: "pM83", Floor: 2, Distance: 0},
  {Minor: 2, Major: 0, Lat: 42.25289476, Long: -85.64162627, KontaktID: "7jSV", Floor: 2, Distance: 0},
  {Minor: 3, Major: 0, Lat: 42.25296, Long: -85.641582, KontaktID: "GUqH", Floor: 2, Distance: 0},
  {Minor: 4, Major: 0, Lat: 42.25302524, Long: -85.64153773, KontaktID: "uBAv", Floor: 2, Distance: 0},
  {Minor: 5, Major: 0, Lat: 42.25309048, Long: -85.64149345, KontaktID: "dwva", Floor: 2, Distance: 0},
  {Minor: 6, Major: 0, Lat: 42.25315571, Long: -85.64144918, KontaktID: "b3Ay", Floor: 2, Distance: 0},
  {Minor: 7, Major: 0, Lat: 42.25322095, Long: -85.6414049, KontaktID: "sK5Q", Floor: 2, Distance: 0},
  {Minor: 8, Major: 0, Lat: 42.25328619, Long: -85.64136063, KontaktID: "7oXx", Floor: 2, Distance: 0},
  {Minor: 9, Major: 0, Lat: 42.25335143, Long: -85.64131636, KontaktID: "Fma5", Floor: 2, Distance: 0},
  {Minor: 10, Major: 0, Lat: 42.25341666, Long: -85.64127208, KontaktID: "vRWR", Floor: 2, Distance: 0},
  {Minor: 11, Major: 0, Lat: 42.2534819, Long: -85.64122781, KontaktID: "GEWh", Floor: 2, Distance: 0},
  {Minor: 12, Major: 0, Lat: 42.25354714, Long: -85.64118353, KontaktID: "0dms", Floor: 2, Distance: 0},
];

var roomArray = {
  "markers": [
  { "title": "C262", coordinates: { latitude: 42.25344401,longitude: -85.64125353},},
  { "title": "B217", coordinates: { latitude: 42.25336261, longitude: -85.64130877},},
  { "title": "B216", coordinates: { latitude: 42.25332347, longitude: -85.64133533},},
  { "title": "B215", coordinates: { latitude: 42.25326321, longitude: -85.64137623},},
  { "title": "B238", coordinates: { latitude: 42.25321537, longitude: -85.64140869},},
  { "title": "B237", coordinates: { latitude: 42.2531756, longitude: -85.64143568},},
  { "title": "B214", coordinates: { latitude: 42.25320418, longitude: -85.64141628},},
  { "title": "B236", coordinates: { latitude: 42.25309048, longitude: -85.64149345},},
  { "title": "B232", coordinates: { latitude: 42.25305134, longitude: -85.64152001},},
  { "title": "B213", coordinates: { latitude: 42.25314516, longitude: -85.64145634},},
  { "title": "B211", coordinates: { latitude: 42.25303518, longitude: -85.64153098},},
  { "title": "B210", coordinates: { latitude: 42.25296497, longitude: -85.64157863},},
  { "title": "B202", coordinates: { latitude: 42.25285589, longitude: -85.6415303},},
  ]
  }


// #endregion
var TestMarker = Marker.coordinate = {
  latitude: 42.25344401, //May need to be BeaconToReturn["Lat"]
  longitude: -85.64125353, //May need to be BeaconToReturn["Long"]
};
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
    beaconsArr: [],
    polyLinePath: [],
    inputText: "",
    userPath: [],
    usersLocation: [],
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
        //console.log("Updated beacons lists",updatedBeaconsLists);
        this.setState({
          beaconsArr: updatedBeaconsLists['rangingList'],
          usersLocation: this.calculateNewCoordinate()
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

  calculateNewCoordinate()
  {
    //Builds the Beacon to return array with the two closest beacons
    let closeBeacons = [];
    closeBeacons = this.findBeaconsClosest();

    if(closeBeacons.length == 0)
    {
      return 0; //Return 0 this will need to be catched by set marker position
    }
    else
    {
      //Set the variables
      let distA = closeBeacons[0].Distance;
      let distB = closeBeacons[1].Distance;
      //Do Math to get the coordinate in between
      let distC = distA/(distA+distB);
      distC = distC.toFixed(1);
      //console.log("distC: ",distC);
      let latA = closeBeacons[0].Lat;
      let latB = closeBeacons[1].Lat;
      let longA = closeBeacons[0].Long;
      let longB = closeBeacons[1].Long;
      let newLat = latA + (latB - latA) * distC;
      let newLong = longA + (longB - longA) * distC;
      // console.log("New Lat and Long",newLat,newLong);
      // console.log("New Lat and Long Types",typeof newLat,typeof newLong,isNaN(newLat),isNaN(newLong));
      let newCoordinate = {newLat,newLong};
      //console.log("Calculated New Lat",newCoordinate);
      return newCoordinate;
    }

  }
//Searches through the beacons list and returns the Beacon Object with Lat and Long
  setMarkerToPosition() {

    var newCoordinate = [];
    //newCoordinate = this.calculateNewCoordinate();
    newCoordinate = this.state.usersLocation;
    if(newCoordinate == 0)
    {
      var NewMarker = Marker.coordinate = null;
    }
    else {

      var NewMarker = Marker.coordinate = {
        latitude: newCoordinate.newLat, //newCoordinate Latitude at Index 0
        longitude: newCoordinate.newLong, //newCoordinate Longitude at Index 1
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
    //console.log("BeaconsArr",this.state.beaconsArr);
    if(this.state.beaconsArr === undefined || this.state.beaconsArr.length == 0)
    {//If the Array is undefined or length is 0 return NULL handle this in the coordinate marker call
      BeaconToReturn = [];
      //console.log("CAUGHT EMPTY LIST");
    }
    else
    {
      do{
          BeaconToReturn[0] = BeaconsLocList[this.state.beaconsArr[i].minor-1];
          BeaconToReturn[0].Distance = this.state.beaconsArr[i].accuracy;
          //console.log("Beacon Array position",i);
          if(i < this.state.beaconsArr.length-1)
          {
            BeaconToReturn[1] = BeaconsLocList[this.state.beaconsArr[i+1].minor-1];
            BeaconToReturn[1].Distance = this.state.beaconsArr[i+1].accuracy;
          }

      }while(this.state.beaconsArr[i++].accuracy < 0 && i < this.state.beaconsArr.length-1);
      //console.log("BeaconToReturn", BeaconToReturn);
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

  createPath(endPoint) {
    let userPathArr = [];
    console.log("Inside Create Path");
    startPoint = {latitude: 42.25354714, longitude: -85.64118353};
    //endPoint = {latitude: 42.25314516, longitude: -85.64145634}
    //Empty Point Check
    if(startPoint === undefined || endPoint === undefined)
    {
      userPathArr = null; //When passing a null to PolyLine it will not place a line nor break anything
    }
    else
    {
      userPathArr.push(startPoint);
      userPathArr.push(endPoint);
    }
      //console.log("User Path Array",userPathArr);
    return userPathArr;
  }

  searchForRoom() {
    let roomCoords = [];
    let i = 0;
    let flag = 0;
    //console.log("Input Text",this.state.inputText);
    //console.log("Room Array",roomArray["markers"][0].title);
    newPoint = this.calculateNewCoordinate();
    startPoint = {latitude: newPoint.newLat, longitude: newPoint.newLong};
    while(i < roomArray["markers"].length && flag != 1)
    {
      //console.log("Room Array Title",roomArray["markers"][i].title,this.state.inputText);
      if(roomArray["markers"][i].title == this.state.inputText)
      {
        roomCoords[0] = startPoint;
        roomCoords[1] = roomArray["markers"][i].coordinates;
        flag = 1
      }
      else
      {
        roomCoords = [{ latitude: 0,longitude: 0},{ latitude: 0,longitude: 0}];
      }
      i++;
    }

    //console.log("Room Coords",roomCoords);
    this.setState({userPath: roomCoords}); //Don't rely on this to be done in time
  }

  onChangeInputText(inputText) {
    this.setState({inputText: inputText});
    //this.setState({usersLocation: this.calculateNewCoordinate()});

    if(inputText == "")
    {
      let roomCoords = [] //Create Blank array of coordinates
      roomCoords = [{ latitude: 0,longitude: 0},{ latitude: 0,longitude: 0}]; //Set Poly Line to 0,0 (YES THIS IS HACK)
      this.setState({userPath: roomCoords}); //State sets suuper slow
      //console.log("inputText is empty: ",this.state.userPath);
    }
    console.log(this.state.inputText);
  }
//Pasting this beneath the Marker in Render will allow you to print ALL markers for each room on the path
    // {roomArray.markers.map((marker,index) => (
    //   <MapView.Marker
    //   key = {index}
    //   coordinate={marker.coordinates}
    //   title={marker.title}
    //   />
    // ))}
//coordinates= {this.state.polyLinePath}


  render() {
    const { bluetoothState, beaconsLists, message} = this.state;
    this.createPathArray();
    let latitude = 42.254254;
    let longitude = -85.640700;
    let longitudeDelta = LONGITUDE_DELTA;
    let latitudeDelta = LATITUDE_DELTA;
    if(this.state.usersLocation){
      latitude = this.state.usersLocation.newLat;
      longitude = this.state.usersLocation.newLong;
    }
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          mapType="satellite"
          style={styles.map}
          region={{latitude: latitude,
                    longitude: longitude,
                    longitudeDelta: 0.0007,
                    latitudeDelta: 0.0003}}
        >
        <Marker
          //title={marker.key}
          image={{ uri: "http://35.203.122.82/locationArt.png"}}
          //key={marker.key}
          coordinate={this.setMarkerToPosition()}
        />
        <Polyline
          coordinates= {this.state.polyLinePath}
          strokeColor="#B1B4BD" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={9}
          zIndex={1}
        />
        <Polyline
          coordinates= {this.state.userPath}
          strokeColor="#3B68F0" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={10}
          zIndex={1}
        />
        <UrlTile
          urlTemplate="http://35.203.122.82/{z}/{x}/{y}.png"
          zIndex={-1}
        />
        </MapView>
        <View style={styles.search}>
           <SearchBar
               round
               lightTheme
               containerStyle={styles.searchBox}
               inputContainerStyle={styles.searchInputBox}
               placeholder='Search'
               inputStyle = {styles.inputstyles}
               clearIcon
               onChangeText={(inputText) => this.onChangeInputText(inputText)}
               onEndEditing={() => this.searchForRoom()}
               onClear={(inputText) => this.onChangeInputText(inputText)}
               onCancel={(inputText) => this.onChangeInputText(inputText)} />
        </View>
        <View style={styles.buttonContainerBR}>
            <TouchableOpacity
                onPress={this.floor}
                style={styles.button}
                >
                <Text>floor</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

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
      backgroundColor: 'rgba(140,140,140,0.7)',
      width: 50,
      height: 50,
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
  search: {
   position: 'absolute',
   left: 16,
   right: 16,
   top: 32,
 },
 searchBox: {
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  borderBottomWidth: 0,
 },
 inputstyles: {
   color: 'black',
 },
});

AppRegistry.registerComponent('reactNativeBeaconExample',() => reactNativeBeaconExample);
