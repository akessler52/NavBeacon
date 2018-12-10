import React from 'react';
import {Text, View, Button, Image, TouchableHighlight, StyleSheet, Container, CustomHeader, Content, Icon} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';


export default class FirstScreen extends React.Component {
 
  render() {
    return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>      
            <HeaderComponent {...this.props} />      
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>
                    The Map will be this screen 
              </Text>
            </View>
        </View>);
  }
  
}
