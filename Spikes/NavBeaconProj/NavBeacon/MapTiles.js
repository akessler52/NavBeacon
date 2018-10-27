import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import MapView, { MAP_TYPES, PROVIDER_GOOGLE, ProviderPropType, UrlTile } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 42.254254;
const LONGITUDE = -85.640700;
const LATITUDE_DELTA = 0.0052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    };
  }

  /*get mapType() {
    // MapKit does not support 'none' as a base map
    return this.props.provider === PROVIDER_DEFAULT ?
      MAP_TYPES.STANDARD : MAP_TYPES.NONE;
  }*/

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
            urlTemplate="`${FileSystem.documentDirectory}MapFiles/{z}/{x}/{y}.png`"
            zIndex={-1}
          />
        </MapView>
      </View>
    );
  }
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

export default MapTiles;
