import React from 'react';
import {Text, View, Button, Image, FlatList} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import { renderItem} from '../general';
import exercises_data from '../exercises';

export default class OfficesScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Screen 2',

  }
  render() {
    return (<View style={{
            flex: 1,
            flexDirection: 'column',
        }}>      
            <HeaderComponent {...this.props} />      
            <View>
              <Text 
                style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold', color: 'black'}}>Directory</Text>
              <FlatList data={exercises_data} renderItem={renderItem} />
            </View>
        </View>);
  }

}