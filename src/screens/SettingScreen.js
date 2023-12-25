import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { Context } from '../utils/context';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { NOTIFICATION_TIMER, USER_ROLE } from '../common/constant';
import { useIsFocused } from '@react-navigation/native';
import userApis from '../apis/User';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingScreen = () => {
  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const [timer, setTimer] = React.useState({
    schedule: NOTIFICATION_TIMER.SCHEDULE,
    exam: NOTIFICATION_TIMER.EXAM,
    event: NOTIFICATION_TIMER.SCHEDULE,
  });
  const [pickerVisible, setPickerVisible] = React.useState(false);
  const [type, setType] = React.useState('schedule');

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getUser();
    setContext({ ...context, isLoading: false });
  }, [isFocus]);

  const getUser = async () => {
    const user = await userApis.get(context.userId);

    if (user) {
      setTimer((prevState) => ({ ...prevState, ...user.timer }));
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {pickerVisible && (
        <RNDateTimePicker
          mode="time"
          timeZoneName="Asia/Ho_Chi_Minh"
          is24Hour={true}
          value={
            new Date(
              1970,
              0,
              1,
              Number.parseInt(timer[`${type}`] / 3600000) - 1,
              (timer[`${type}`] % 3600000) / 60000,
              0,
            )
          }
          minuteInterval={5}
          onChange={(e, date) => {
            const diff = 1;
            setPickerVisible(false);
            if (e.type === 'set') {
              userApis.update({
                timer: {
                  ...timer,
                  [`${type}`]: ((date.getHours() + diff) % 24) * 3600000 + date.getMinutes() * 60000,
                },
              });

              setTimer({
                ...timer,
                [`${type}`]: ((date.getHours() + diff) % 24) * 3600000 + date.getMinutes() * 60000,
              });
            }
          }}
        />
      )}
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'center',
          height: 100,
          borderRadius: 4,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="alarm" color="#2596be" size={24} />
          <Text style={{ fontSize: 16, color: '#000', flex: 3, marginLeft: 10 }}>Thông báo trước giờ học</Text>
          {/* <Switch style={{ flex: 1 }} /> */}
        </View>
        <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => {
            setType('schedule');
            setPickerVisible(true);
          }}
        >
          <Text style={{ fontSize: 32, color: '#2596be', textAlign: 'right' }}>
            {`00${Math.floor(timer.schedule / 3600000)}`.substring(
              `00${Math.floor(timer.schedule / 3600000)}`.length - 2,
            )}
            :
            {`00${Math.floor((timer.schedule % 3600000) / 60000)}`.substring(
              `00${Math.floor((timer.schedule % 3600000) / 60000)}`.length - 2,
            )}
          </Text>
        </TouchableOpacity>
      </View>
      {context.role === USER_ROLE.student && (
        <View
          style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            height: 100,
            borderRadius: 4,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="alarm" color="#2596be" size={24} />
            <Text style={{ fontSize: 16, color: '#000', flex: 3, marginLeft: 10 }}>Thông báo trước giờ thi</Text>
            {/* <Switch style={{ flex: 1 }} /> */}
          </View>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => {
              setType('exam');
              setPickerVisible(true);
            }}
          >
            <Text style={{ fontSize: 32, color: '#2596be', textAlign: 'right' }}>
              {`00${Math.floor(timer.exam / 3600000)}`.substring(`00${Math.floor(timer.exam / 3600000)}`.length - 2)}:
              {`00${Math.floor((timer.exam % 3600000) / 60000)}`.substring(
                `00${Math.floor((timer.exam % 3600000) / 60000)}`.length - 2,
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'center',
          height: 100,
          borderRadius: 4,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="alarm" color="#2596be" size={24} />
          <Text style={{ fontSize: 16, color: '#000', flex: 3, marginLeft: 10 }}>Thông báo trước sự kiện</Text>
          {/* <Switch style={{ flex: 1 }} /> */}
        </View>
        <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => {
            setType('event');
            setPickerVisible(true);
          }}
        >
          <Text style={{ fontSize: 32, color: '#2596be', textAlign: 'right' }}>
            {`00${Math.floor(timer.event / 3600000)}`.substring(`00${Math.floor(timer.event / 3600000)}`.length - 2)}:
            {`00${Math.floor((timer.event % 3600000) / 60000)}`.substring(
              `00${Math.floor((timer.event % 3600000) / 60000)}`.length - 2,
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
