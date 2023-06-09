import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>HomeScreen</Text>        
      </View>
    </View>
  );
};

export default HomeScreen;
