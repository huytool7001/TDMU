import React from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import studyScheduleAPIs from '../apis/StudySchedule';
import { Context } from '../utils/context';
import styles from '../themes/screens/StudyScheduleScreen';
import dropdownStyles from '../themes/components/DropDown';
import { useIsFocused } from '@react-navigation/native';
import { NOTIFICATION_TIMER, USER_ROLE } from '../common/constant';
import Modal from 'react-native-modal';
import StudentList from '../components/StudentList';
import userApis from '../apis/User';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const StudyScheduleScreen = () => {
  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const [data, setData] = React.useState(null);
  const [schedule, setSchedule] = React.useState([]);

  //semester
  const [semesters, setSemesters] = React.useState([]);
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  //week
  const [weekOpen, setWeekOpen] = React.useState(false);
  const [selectedWeek, setSelectedWeek] = React.useState(null);

  //modal
  const [modal, setModal] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  //students
  const [students, setStudents] = React.useState([]);

  //timer
  const [timer, setTimer] = React.useState(NOTIFICATION_TIMER.SCHEDULE);
  const [pickerVisible, setPickerVisible] = React.useState(false);

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getSemesters();
    getUser();
    setContext({ ...context, isLoading: false });
  }, [isFocus]);

  const getSemesters = async () => {
    const result = await studyScheduleAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);

      let isSelectedSemester = false;
      result.data.ds_hoc_ky.forEach((hoc_ky) => {
        let dateParts = hoc_ky.ngay_bat_dau_hk?.split('/');
        hoc_ky.ngay_bat_dau_hk = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        dateParts = hoc_ky.ngay_ket_thuc_hk?.split('/');
        hoc_ky.ngay_ket_thuc_hk = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        const date = new Date();
        if (hoc_ky.ngay_bat_dau_hk <= date && hoc_ky.ngay_ket_thuc_hk > date) {
          setSelectedSemester(hoc_ky.hoc_ky);
          isSelectedSemester = true;
        }
      });

      if (!isSelectedSemester) {
        setSelectedSemester(result.data.ds_hoc_ky[0].hoc_ky);
      }
    }
  };

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getSchedule();
    setContext({ ...context, isLoading: false });
  }, [selectedSemester]);

  const getSchedule = async () => {
    const result = await studyScheduleAPIs.getSchedule(context.token, selectedSemester, context.userId);

    if (result.code === 200) {
      setData(result.data);

      let isSelectedWeek = false;
      result.data.ds_tuan_tkb.forEach((tuan, index) => {
        let dateParts = tuan.ngay_bat_dau?.split('/');
        tuan.ngay_bat_dau = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        dateParts = tuan.ngay_ket_thuc?.split('/');
        tuan.ngay_ket_thuc = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        const date = new Date();
        if (tuan.ngay_bat_dau <= date && tuan.ngay_ket_thuc > date) {
          setSelectedWeek(index);
          isSelectedWeek = true;
        }
      });

      if (!isSelectedWeek) {
        setSelectedWeek(0);
      }
    }
  };

  const getStudents = async (id) => {
    const result = await studyScheduleAPIs.getStudents(context.token, id);

    if (result.code === 200) {
      setStudents(result.data.ds_sinh_vien);
    } else {
      setStudents([]);
    }

    setModal('students');
    setModalVisible(true);
  };

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    if (data !== null && selectedWeek !== null) {
      let result = data.ds_tuan_tkb[selectedWeek].ds_thoi_khoa_bieu.reduce((accumulator, currentValue) => {
        (accumulator[currentValue['ngay_hoc']] = accumulator[currentValue['ngay_hoc']] || []).push(currentValue);
        return accumulator;
      }, {});

      result = Object.keys(result).map((key) => {
        return { day: key, data: result[key] };
      });

      setSchedule(result);
    }
    setContext({ ...context, isLoading: false });
  }, [selectedWeek, data]);

  const onSemesterOpen = React.useCallback(() => {
    setWeekOpen(false);
  }, []);

  const onWeekOpen = React.useCallback(() => {
    setSemesterOpen(false);
  }, []);

  const getUser = async () => {
    const user = await userApis.get(context.userId);

    if (user) {
      setTimer(user.timer.schedule);
    }
  };

  React.useEffect(() => {
    userApis.update({
      'timer.schedule': timer,
    });
  }, [timer]);

  return (
    <View style={{ flex: 1 }}>
      {pickerVisible && (
        <RNDateTimePicker
          mode="time"
          timeZoneName="Asia/Ho_Chi_Minh"
          is24Hour={true}
          value={new Date(1970, 0, 1, Number.parseInt(timer / 3600000) - 1, (timer % 3600000) / 60000, 0)}
          minuteInterval={5}
          onChange={(e, date) => {
            const diff = 1;
            setPickerVisible(false);
            if (e.type === 'set') {
              setTimer(((date.getHours() + diff) % 24) * 3600000 + date.getMinutes() * 60000);
            }
          }}
        />
      )}

      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        children={
          modal === 'students' ? (
            <StudentList data={students} />
          ) : modal === 'timer' ? (
            <View style={{ padding: 10 }}>
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
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 16, color: '#000', flex: 3 }}>Thông báo trước giờ học</Text>
                  {/* <Switch style={{ flex: 1 }} /> */}
                </View>
                <TouchableOpacity style={{ margin: 10 }} onPress={() => setPickerVisible(true)}>
                  <Text style={{ fontSize: 32, color: '#000', textAlign: 'right' }}>
                    {`00${Math.floor(timer / 3600000)}`.substring(`00${Math.floor(timer / 3600000)}`.length - 2)}:
                    {`00${Math.floor((timer % 3600000) / 60000)}`.substring(
                      `00${Math.floor((timer % 3600000) / 60000)}`.length - 2,
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                title="Đóng X"
                style={{ bottom: 0, position: 'absolute' }}
                onPress={() => setModalVisible(false)}
                color="#cc0000"
              />
            </View>
          ) : (
            <></>
          )
        }
      ></Modal>
      <View style={dropdownStyles.container}>
        <DropDownPicker
          open={semesterOpen}
          value={selectedSemester}
          items={semesters.map((hoc_ky) => {
            return { label: hoc_ky.ten_hoc_ky, value: hoc_ky.hoc_ky };
          })}
          setOpen={setSemesterOpen}
          setValue={setSelectedSemester}
          onOpen={onSemesterOpen}
          dropDownContainerStyle={dropdownStyles.dropDownContainer}
        />
      </View>
      {data !== null && data.ds_tuan_tkb?.length > 0 ? (
        <View style={[dropdownStyles.container, { top: 50, zIndex: 2 }]}>
          <DropDownPicker
            open={weekOpen}
            value={selectedWeek}
            items={data.ds_tuan_tkb.map((tuan, index) => {
              return { label: tuan.thong_tin_tuan, value: index };
            })}
            setOpen={setWeekOpen}
            setValue={setSelectedWeek}
            onOpen={onWeekOpen}
            dropDownContainerStyle={dropdownStyles.dropDownContainer}
          />
        </View>
      ) : null}

      <FlatList
        style={styles.contentContainer}
        data={schedule}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={styles.textDate}>
              {new Date(item.day).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Timeline
              data={item.data}
              innerCircle={'dot'}
              circleColor="#2596be"
              circleSize={18}
              dotSize={12}
              lineColor="#2596be"
              renderTime={(rowData) => (
                <View style={{ minWidth: 36 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {data.ds_tiet_trong_ngay.find((tiet) => tiet.tiet === rowData.tiet_bat_dau).gio_bat_dau}
                  </Text>
                </View>
              )}
              renderDetail={(rowData) => (
                <View style={{ marginTop: -12 }}>
                  <Text style={styles.textSubjectName}>{rowData.ten_mon}</Text>
                  {context.role === USER_ROLE.student && (
                    <Text>
                      <MaterialIcons name="how-to-reg" color="#2596be" />
                      {'\t'}
                      {rowData.ten_giang_vien}
                    </Text>
                  )}
                  <Text>
                    <MaterialIcons name="place" color="#2596be" />
                    {'\t'}
                    {rowData.ma_phong}
                  </Text>
                  <Text>
                    <MaterialIcons name="access-time" color="#2596be" />
                    {'\t'}
                    {data.ds_tiet_trong_ngay.find((tiet) => tiet.tiet === rowData.tiet_bat_dau).gio_bat_dau} -
                    {
                      data.ds_tiet_trong_ngay.find((tiet) => tiet.tiet === rowData.tiet_bat_dau + rowData.so_tiet - 1)
                        .gio_ket_thuc
                    }
                  </Text>
                  {context.role === USER_ROLE.teacher && (
                    <Text onPress={() => getStudents(rowData.id_to_hoc)}>
                      <MaterialIcons name="format-list-bulleted" color="#2596be" />
                      {'\t'}
                      Danh Sách Sinh Viên
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 20,
          right: 20,
          height: 70,
          backgroundColor: '#2596be',
          borderRadius: 100,
        }}
        onPress={() => {
          setModal('timer');
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="access-alarm" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default StudyScheduleScreen;
