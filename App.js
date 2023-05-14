import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerContent } from './src/components/DrawerContent';
import RootStackScreen from './src/screens/RootStackScreen';

import { Context } from './src/utils/context';
import Spinner from 'react-native-loading-spinner-overlay';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Drawer = createDrawerNavigator();

function App() {
  const [context, setContext] = React.useState({
    token: null,
    isLoading: false,
  });

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      setContext({ ...context, token: currentUser.idToken });
    }
  };

  React.useEffect(() => {
    setTimeout(getCurrentUser, 500);
  }, []);

  return (
    <Context.Provider value={[context, setContext]}>
      <Spinner visible={context.isLoading} />
      <NavigationContainer>
        {context.token !== null ? (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
          </Drawer.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
