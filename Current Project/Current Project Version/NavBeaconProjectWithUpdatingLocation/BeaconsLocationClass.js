import React, { Component } from 'react';
//Object of Beacons with Corresponding location
/*var BeaconsLocation = {
  Minor: 0, //Minor Beacon Value
  Major: 0, //Major Beacon Value
  Lat: 0.0, //Latitude the Beacon Is Placed On
  Long: 0.0, //Longitude the Beacon Is Placed On
  KontaktID: "" //The KontaktID
};

//Beacons Array To Store all BeaconsLocation Objects
var BeaconsLocList = new Array();*/
class BeaconsLocation {
  
  var BeaconsLocList = [
    {},
    {Minor: 1 Major: 0 Lat: 42.252824 Long: -85.641454 KontaktID: "pM83"},
    {Minor: 2 Major: 0 Lat: 42.252873 Long: -85.641522 KontaktID: "7jSV"},
    {Minor: 3 Major: 0 Lat: 42.252934 Long: -85.641554 KontaktID: "GUqH"},
  ];

  searchBeaconList(Minor)
  { //Searches through the beacons list and returns the Beacon Object with Lat and Long
    var BeaconToReturn;
    for(i=1; i < BeaconsLocList.length; i++)
    {
      if(BeaconsLocList[i].Minor == Minor)
      {
        BeaconToReturn = BeaconsLocList[i];
      }
    }
    return BeaconToReturn;
  };

} //End of Class

const BeaconsFinder = new BeaconsLocation();
export default BeaconsFinder;
