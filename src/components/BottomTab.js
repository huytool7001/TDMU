import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import ChatScreen from '../screens/ChatScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import GroupMembersScreen from '../screens/GroupMembersScreen';
import { Context } from '../utils/context';
import firestore from '@react-native-firebase/firestore';
import { USER_ROLE } from '../common/constant';
import AddMembersScreen from '../screens/AddMembersScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transparent';

  return (
    <Tab.Navigator activeColor="#fff" barStyle={{ backgroundColor: '#2596be' }} shifting={true}>
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
        name="ChatStack"
        component={ChatStackScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Icon name="chat" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={AnnouncementStackScreen}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color }) => <Icon name="bell" size={26} color={color} />,
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
        component={CalendarScreen}
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

const AnnouncementStackScreen = ({ navigation }) => {
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
        name="Announcement"
        component={AnnouncementScreen}
        options={{
          title: 'Thông báo',
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

const ChatStackScreen = ({ navigation }) => {
  const [context, setContext] = useContext(Context);

  return (
    <Stack.Navigator
      initialRouteName="GroupChat"
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
        name="GroupChat"
        component={GroupChatScreen}
        options={{
          title: 'Nhóm',
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
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerTitleAlign: 'center',
          title: route.params.channel.name,
          headerTitleContainerStyle: { width: '70%' },
          headerLeft: () => (
            <Icon
              name="chevron-left"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.navigate('GroupChat')}
            ></Icon>
          ),
          headerRight: () => (
            <Menu>
              <MenuTrigger
                children={
                  <Icon
                    name="dots-vertical"
                    size={25}
                    backgroundColor="#2596be"
                    color="#fff"
                    style={{ marginRight: 13 }}
                  ></Icon>
                }
              />
              <MenuOptions
                customStyles={{
                  optionsContainer: { width: 150, marginTop: 30, marginLeft: -10 },
                  optionWrapper: { margin: 5 },
                  optionText: { color: '#000' },
                }}
              >
                <MenuOption
                  text="Xem thành viên"
                  onSelect={() => {
                    navigation.navigate('GroupMembers', { channel: route.params.channel });
                  }}
                />
                {context.role === USER_ROLE.teacher && (
                  <>
                    <MenuOption
                      text="Thêm thành viên"
                      onSelect={() => navigation.navigate('AddMember', { channel: route.params.channel })}
                    />
                    <MenuOption
                      text="Xóa nhóm"
                      onSelect={() =>
                        Alert.alert('Lưu ý', 'Mọi dữ liệu của nhóm này sẽ bị xóa vĩnh viễn', [
                          { text: 'Hủy', style: 'cancel' },
                          {
                            text: 'Xóa',
                            onPress: async () => {
                              await firestore().collection('GROUPS').doc(route.params.channel.id).delete();
                              navigation.navigate('GroupChat');
                            },
                          },
                        ])
                      }
                    />
                  </>
                )}
              </MenuOptions>
            </Menu>
          ),
        })}
      />
      <Stack.Screen
        name="GroupMembers"
        component={GroupMembersScreen}
        options={({ route }) => ({
          headerTitleAlign: 'center',
          title: route.params.channel.name,
          headerTitleContainerStyle: { width: '70%' },
          headerLeft: () => (
            <Icon
              name="chevron-left"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.navigate('Chat', { channel: route.params.channel })}
            ></Icon>
          ),
        })}
      />
      <Stack.Screen
        name="AddMember"
        component={AddMembersScreen}
        options={({ route }) => ({
          headerTitleAlign: 'center',
          title: route.params.channel.name,
          headerTitleContainerStyle: { width: '70%' },
          headerLeft: () => (
            <Icon
              name="chevron-left"
              size={25}
              backgroundColor="#2596be"
              color="#fff"
              style={{ marginLeft: 13 }}
              onPress={() => navigation.navigate('Chat', { channel: route.params.channel })}
            ></Icon>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default BottomTabNavigator;
