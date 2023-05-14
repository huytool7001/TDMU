import * as React from 'react';
import { View, Text } from 'react-native';

const ProfileScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>This is profile screen</Text>        
      </View>
    </View>
  );
};

export default ProfileScreen;
