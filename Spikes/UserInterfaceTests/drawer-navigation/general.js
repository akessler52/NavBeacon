import React from 'react';
import { Text, TouchableHighlight, Picker } from 'react-native';
import styles from './styles';

function renderItem({item}) {
    return (
      <TouchableHighlight underlayColor="#ccc" onPress={() => {
        console.log('pressed!');
      }} style={styles.list_item}>
        <Text>
          <Text style={{fontSize: 30}}>{item.name}{'\n'}</Text>
          <Text>{item.department}, </Text>
          <Text style={{fontStyle: 'italic'}}>{item.position}</Text>
        </Text>
      </TouchableHighlight>
    );
}

function renderPickerItems(data) {
  return data.map((item) => {
    let val = item.name.toLowerCase();
    return (
      <Picker.Item key={item.key} label={item.name} value={val} />
    );
  });
}

export { renderItem, renderPickerItems };