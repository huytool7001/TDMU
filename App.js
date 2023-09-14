import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Context } from './src/utils/context';
import { DrawerContent } from './src/components/DrawerContent';
import RootStackScreen from './src/screens/RootStackScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudyScheduleScreen from './src/screens/StudyScheduleScreen';
import TranscriptScreen from './src/screens/TranscriptScreen';
import ExamScheduleScreen from './src/screens/ExamScheduleScreen';
import ReLoginAlert from './src/components/ReLoginAlert';
import TuitionScreen from './src/screens/TuitionScreen';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { NOTIFICATION_TIMER } from './src/common/constant';
import ReactNativeModal from 'react-native-modal';
import userApis from './src/apis/User';

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

  const [screen, setScreen] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState(false);
  const [timer, setTimer] = React.useState({
    schedule: NOTIFICATION_TIMER.SCHEDULE,
    exam: NOTIFICATION_TIMER.EXAM,
  });

  const logout = async () => {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser) {
      await GoogleSignin.signOut();
    }
  };

  const getUser = async () => {
    const user = await userApis.get(context.userId);

    if (user) {
      setTimer({ schedule: user.timer.schedule, exam: user.timer.exam });
    }
  };

  React.useEffect(() => {
    logout();
  }, []);

  React.useEffect(() => {
    userApis.update({
      timer: {
        schedule: timer.schedule,
        exam: timer.exam,
      },
    });
  }, [timer]);

  React.useEffect(() => {
    if (context.userId) {
      getUser();
    }
  }, [context.userId]);

  return (
    <Context.Provider value={[context, setContext]}>
      <Spinner visible={context.isLoading} />
      <ReactNativeModal
        onBackButtonPress={() => setShowModal(false)}
        isVisible={showModal}
        children={
          <View
            style={{
              backgroundColor: '#bcecff',
              alignItems: 'center',
              justifyContent: 'center',
              height: 150,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 20 }}>Thông báo trước giờ {screen === 'schedule' ? 'học' : 'thi'}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 10 }}>
              {screen && (
                <Text>
                  {Math.floor(timer[screen] / 3600000)} giờ {Math.floor((timer[screen] % 3600000) / 60000)} phút
                </Text>
              )}
              <Icon name="lead-pencil" size={20} onPress={() => setShowPicker(true)} />
            </View>
            <Button title="Đóng X" onPress={() => setShowModal(false)} color="#cc0000"></Button>
          </View>
        }
      />
      {showPicker && (
        <RNDateTimePicker
          mode="time"
          is24Hour={true}
          value={new Date(1970, 0, 1, timer[screen] / 3600000, (timer[screen] % 3600000) / 60000, 0)}
          minuteInterval={5}
          onChange={(e, date) => {
            setShowPicker(false);
            if (e.type === 'set') {
              setTimer({ ...timer, [screen]: date.getHours() * 3600000 + date.getMinutes() * 60000 });
            }
          }}
        />
      )}
      {context.expire && <ReLoginAlert />}
      <NavigationContainer>
        {context.token ? (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{ drawerStyle: { width: 312 } }}
          >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
            <Drawer.Screen
              name="StudySchedule"
              component={StudyScheduleScreen}
              options={{
                title: 'Thời khóa biểu',
                headerRight: () => (
                  <Icon
                    name="alarm"
                    size={28}
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      setScreen('schedule');
                      setShowModal(true);
                    }}
                  />
                ),
              }}
            />
            <Drawer.Screen name="Transcript" component={TranscriptScreen} options={{ title: 'Xem điểm' }} />
            <Drawer.Screen
              name="ExamSchedule"
              component={ExamScheduleScreen}
              options={{
                title: 'Xem lịch thi',
                headerRight: () => (
                  <Icon
                    name="alarm"
                    size={28}
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      setScreen('exam');
                      setShowModal(true);
                    }}
                  />
                ),
              }}
            />
            <Drawer.Screen name="Tuition" component={TuitionScreen} options={{ title: 'Xem học phí' }} />
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
          </Drawer.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
