import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import { DrawerContent } from '../components/DrawerContent';

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
    <RootStack.Screen name="HomeDrawer" component={DrawerContent}/>
  </RootStack.Navigator>
);

export default RootStackScreen;
