import React from 'react';
import {Text, View, Button, Image} from 'react-native';


export default class SecondScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Screen 2',

  }
  render() {
    return <View style={
      { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }   
    }>
      <Text style = {{fontSize:30, color: 'blue'}}>
        Screen 2
      </Text>
      <Button
        onPress={() => this.props.navigation.navigate('DrawerOpen')}
        title= "OpenDrawerNavigator"
      />
      </View>
  }

}