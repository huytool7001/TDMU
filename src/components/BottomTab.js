import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import StudyScheduleScreen from '../screens/StudyScheduleScreen';
import TranscriptScreen from '../screens/TranscriptScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transparent';

  return (
    <Tab.Navigator
      activeColor="#fff"
      barStyle={{ backgroundColor: '#2596be' }}
      shifting={true}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => <Icon name="home" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="StudyScheduleStack"
        component={StudyScheduleStackScreen}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ color }) => <Icon name="calendar" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="TranscriptStack"
        component={TranscriptStackScreen}
        options={{
          tabBarLabel: 'Điểm',
          tabBarIcon: ({ color }) => <Icon name="numeric-9-plus-box-multiple" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ color }) => <Icon name="badge-account-horizontal" size={26} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2596be',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="menu"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            ></Icon>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const StudyScheduleStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2596be',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="StudySchedule"
        component={StudyScheduleScreen}
        options={{
          title: 'Thời khóa biểu',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="menu"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            ></Icon>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2596be',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="menu"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            ></Icon>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const TranscriptStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2596be',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Transcript"
        component={TranscriptScreen}
        options={{
          title: 'Điểm',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="menu"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.openDrawer()}
            ></Icon>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default BottomTabNavigator;
