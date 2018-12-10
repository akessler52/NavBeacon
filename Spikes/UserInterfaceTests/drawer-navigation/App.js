import * as React from 'react';
import { Text, View, StyleSheet, Button, Platform, ScrollView} from 'react-native';
import { Constants } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // 0.19.1

import {DrawerNavigator} from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import OfficesScreen from './screens/OfficesScreen';
import FoodScreen from './screens/FoodScreen';
import BathroomsScreen from './screens/BathroomsScreen';

//this is the drawer and you list each option you would like on the drawer
const DrawerExample = DrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Events: {
      screen: SecondScreen
    },
    Offices: {
      screen: OfficesScreen
    },
    Food: {
      screen: FoodScreen
    },
    Bathrooms: {
      screen: BathroomsScreen
    }
    
  },
  //this is the drawer navigator settings
  {
    initialRouteName: 'Home',
   	drawerPosition: 'left',
   	drawerOpenRoute: 'DrawerOpen',
   	drawerCloseRoute: 'DrawerClose',
   	drawerToggleRoute: 'DrawerToggle'
  }
);

export default DrawerExample;


