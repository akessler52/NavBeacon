import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import MapView, { MAP_TYPES, PROVIDER_GOOGLE, ProviderPropType, UrlTile, Marker } from 'react-native-maps';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 42.254254;
const LONGITUDE = -85.640700;
const LATITUDE_DELTA = 0.0052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var BeaconsLocList = [
  {Minor: 1, Major: 0, Lat: 42.252824, Long: -85.641454, KontaktID: "pM83", Floor: 2},
  {Minor: 2, Major: 0, Lat: 42.252873, Long: -85.641522, KontaktID: "7jSV", Floor: 2},
  {Minor: 3, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "GUqH", Floor: 2},
  {Minor: 4, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "uBAv", Floor: 2},
  {Minor: 5, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "dwva", Floor: 2},
  {Minor: 6, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "b3Ay", Floor: 2},
  {Minor: 7, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "sK5Q", Floor: 2},
  {Minor: 8, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "7oXx", Floor: 2},
  {Minor: 9, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "Fma5", Floor: 2},
  {Minor: 10, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "vRWR", Floor: 2},
  {Minor: 11, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "GEWh", Floor: 2},
  {Minor: 12, Major: 0, Lat: 42.252934, Long: -85.641554, KontaktID: "0dms", Floor: 2},
];


class MapTiles extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
        marker: null,
    };
  }

  render() {
    const { region } = this.state;
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          mapType={this.mapType}
          style={styles.map}
          initialRegion={region}
        >
          <UrlTile
            urlTemplate="file:///Users/ryanhamilton/GitHub/NavBeacon/Spikes/BeaconDemoToRefactor/MapFiles/{z}/{x}/{y}.png"
            zIndex={-1}
          />
          <Marker
            /*title={marker.key}
            image={flagPinkImg}
            key={marker.key}*/
            coordinate = {this.searchBeaconList(beaconArray[0].minor)}
          />
        </MapView>
      </View>
    );
  }

  searchBeaconList(Minor)
  { //Searches through the beacons list and returns the Beacon Object with Lat and Long
    var i;
    var BeaconToReturn
    for(i=0; i < BeaconsLocList.length; i++)
    {
      if(BeaconsLocList[i].Minor == Minor)
      {
        BeaconToReturn = BeaconsLocList[i];
      }
    }

    var NewMarker = Marker.coordinate = {
      latitude: BeaconToReturn.Lat, //May need to be BeaconToReturn["Lat"]
      longitude: BeaconToReturn.Long, //May need to be BeaconToReturn["Long"]
    };

    /* For Reference LatLong is a Marker Type
      type LatLng {
      latitude:
      longtiude:
    }
    */
    return NewMarker;

  };
}

MapTiles.propTypes = {
  provider: ProviderPropType,
};

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
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default MapTiles; //Export this class to be displayed
