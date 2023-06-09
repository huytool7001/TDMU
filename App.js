import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import { Context } from './src/utils/context';
import { DrawerContent } from './src/components/DrawerContent';
import RootStackScreen from './src/screens/RootStackScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudyScheduleScreen from './src/screens/StudyScheduleScreen';
import TranscriptScreen from './src/screens/TranscriptScreen';
import ExamScheduleScreen from './src/screens/ExamScheduleScreen';
import ReLoginAlert from './src/components/ReLoginAlert';

const Drawer = createDrawerNavigator();

function App() {
  const [context, setContext] = React.useState({
    token: null,
    isLoading: false,
    expire: false,
  });

  const getCurrentUser = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      await GoogleSignin.signOut()
    }
  };

  React.useEffect(() => {
    setTimeout(getCurrentUser, 1000);
  }, []);

  return (
    <Context.Provider value={[context, setContext]}>
      <Spinner visible={context.isLoading} />
      {context.expire && <ReLoginAlert />}
      <NavigationContainer>
        {context.token !== null ? (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
            <Drawer.Screen name="StudySchedule" component={StudyScheduleScreen} options={{ title: 'Thời khóa biểu' }}/>
            <Drawer.Screen name="Transcript" component={TranscriptScreen} options={{ title: 'Xem điểm' }}/>
            <Drawer.Screen name="ExamSchedule" component={ExamScheduleScreen} options={{ title: 'Xem lịch thi' }}/>
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }}/>
          </Drawer.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
