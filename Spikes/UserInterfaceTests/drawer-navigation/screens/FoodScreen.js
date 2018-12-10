import React from 'react';
import {Text, View, Button, Image} from 'react-native';


export default class FoodScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Screen 1',

  }
  render() {
    return <View style={
      { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }   
    }>
      <Text style = {{fontSize:30, color: 'green'}}>
        Cafe - location
      </Text>
      <Button
        onPress={() => this.props.navigation.navigate('DrawerOpen')}
        title= "OpenDrawerNavigator"
      />
      </View>
  }

}