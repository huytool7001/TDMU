import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContent } from '../components/DrawerContent';
import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
    <RootStack.Screen name="HomeDrawer" component={DrawerContent}/>
  </RootStack.Navigator>
);

export default RootStackScreen;
