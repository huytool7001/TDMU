import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Context } from './src/utils/context';
import { DrawerContent } from './src/components/DrawerContent';
import RootStackScreen from './src/screens/RootStackScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StudyScheduleScreen from './src/screens/StudyScheduleScreen';
import TranscriptScreen from './src/screens/TranscriptScreen';
import ExamScheduleScreen from './src/screens/ExamScheduleScreen';
import ReLoginAlert from './src/components/ReLoginAlert';
import TuitionScreen from './src/screens/TuitionScreen';
import { USER_ROLE } from './src/common/constant';
import BottomTabNavigator from './src/components/BottomTab';

const Drawer = createDrawerNavigator();

function App() {
  const [context, setContext] = React.useState({
    token: '',
    role: '',
    userId: '',
    isLoading: false,
    expire: false,
    timer: null,
  });

  const logout = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      await GoogleSignin.signOut();
    }
  };

  React.useEffect(() => {
    logout();
  }, []);

  return (
    <Context.Provider value={[context, setContext]}>
      <StatusBar backgroundColor="#2596be" />
      <Spinner visible={context.isLoading} />
      {context.expire && <ReLoginAlert />}
      <NavigationContainer>
        {context.token ? (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{ drawerStyle: { width: 312 } }}
          >
            <Drawer.Screen name="HomeBottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Drawer.Screen
              name="StudySchedule"
              component={StudyScheduleScreen}
              options={{
                title: 'Thời khóa biểu',
                headerStyle: {
                  backgroundColor: '#2596be',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen
              name="Transcript"
              component={TranscriptScreen}
              options={{
                title: 'Điểm',
                headerStyle: {
                  backgroundColor: '#2596be',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
              }}
            />
            <Drawer.Screen
              name="ExamSchedule"
              component={ExamScheduleScreen}
              options={{
                title: 'Lịch thi',
                headerStyle: {
                  backgroundColor: '#2596be',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
              }}
            />
            {context.role === USER_ROLE.student && (
              <Drawer.Screen
                name="Tuition"
                component={TuitionScreen}
                options={{
                  title: 'Học phí',
                  headerStyle: {
                    backgroundColor: '#2596be',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                }}
              />
            )}
            <Drawer.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: 'Hồ sơ',
                headerStyle: {
                  backgroundColor: '#2596be',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
              }}
            />
          </Drawer.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
