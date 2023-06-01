import * as React from 'react';
import { View, Text } from 'react-native';
import { Context } from '../utils/context';
import profileAPIs from '../apis/Profile';

const ProfileScreen = () => {
  const [context, setContext] = React.useContext(Context);

  React.useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const result = await profileAPIs.get(context.token);
    console.log(result);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>This is profile screen</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
