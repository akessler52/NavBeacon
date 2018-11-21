  calculateNewCoordinate() //Gives an average
  {
    //Builds the Beacon to return array with the two closest beacons
    let closeBeacons = [];
    closeBeacons = this.findBeaconsClosest();
    let averagePercentage = 0;
    let index=0;
    if(closeBeacons.length == 0)
    {
      return 0; //Return 0 this will need to be catched by set marker position
    }
    else
    {
      let distA, distB, distC;
      while(index < 2)
      {
        closeBeacons = this.findBeaconsClosest();
        //Set the variables
        distA = closeBeacons[0].Distance;
        distB = closeBeacons[1].Distance;
        //Do Math to get the coordinate in between
        distC = distA/(distA+distB);
        averagePercentage += distC;
        index++;
      }
      distC = distC/index;
      distC = distC.toFixed(2);
      console.log("distC: ",distC);
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

    Ranging: Listen for beacon changes
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

    monitoring events
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

    //Pasting this beneath the Marker in Render will allow you to print ALL markers for each room on the path
    {roomArray.markers.map((marker,index) => (
    <MapView.Marker
      key = {index}
      coordinate={marker.coordinates}
      title={marker.title}
    />
  ))}


  // Alert.alert(
  //   'Navigate to '+this.state.inputText+'?',
  //   'Are you sure?',
  // [
  //   {text: 'Yes', onPress: () => this.createPath()},
  //   {text: 'No', onPress: () => console.log('No Pressed')},
  // ])

  <MapView
    provider={PROVIDER_GOOGLE}
    mapType="satellite"
    style={styles.map}
    region={{
    latitude: latitude,
    longitude: longitude,
    longitudeDelta: longitudeDelta,
    latitudeDelta: latitudeDelta,}}
    onRegionChange={(newRegion) => this.onRegionChange(newRegion)}
  >
  <Marker
    image={positionMarker}
    //key={marker.key}
    coordinate={this.setMarkerToPosition()}
  />
  <Marker
    coordinate={this.state.endLocation}
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
