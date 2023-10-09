import React from 'react';
import { View, Text, FlatList, Button, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
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
import { Table, Row, Rows } from 'react-native-table-component';
import userApis from '../apis/User';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const StudyScheduleScreen = () => {
  const colors = ['#ff0000', '#ff6f00', '#f6ff00', '#00ff04', '#0084ff', '#aa00ff', '#ff0073'];
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

  //note
  const [note, setNote] = React.useState({
    content: '',
    color: 0,
    timer: NOTIFICATION_TIMER.SCHEDULE,
    notified: false,
    showPicker: false,
    scheduleId: '',
  });

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

  const handleSavingNote = async () => {
    if (note.content) {
      setContext({ ...context, isLoading: true });
      await studyScheduleAPIs.updateNote({
        ...note,
        userId: context.userId,
        note: note.content,
        color: colors[note.color],
      });

      const curWeek = selectedWeek;
      await getSchedule();
      setSelectedWeek(curWeek);
      setContext({ ...context, isLoading: false });
    }
    setModalVisible(false);
  };

  const handleDeletingNote = async () => {
    Alert.alert('Lưu ý', 'Bạn có chắc muốn xóa ghi chú này?!', [
      {
        text: 'Hủy',
      },
      {
        text: 'Có',
        onPress: async () => {
          setContext({ ...context, isLoading: true });
          await studyScheduleAPIs.deleteNote(context.userId, note.scheduleId);
          const curWeek = selectedWeek;
          await getSchedule();
          setSelectedWeek(curWeek);
          setModalVisible(false);
          setContext({ ...context, isLoading: false });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {pickerVisible && (
        <RNDateTimePicker
          mode="time"
          is24Hour={true}
          value={new Date(1970, 0, 1, timer / 3600000, (timer % 3600000) / 60000, 0)}
          minuteInterval={5}
          onChange={(e, date) => {
            setPickerVisible(false);
            if (e.type === 'set') {
              setTimer(date.getHours() * 3600000 + date.getMinutes() * 60000);
            }
          }}
        />
      )}

      {note.showPicker && (
        <RNDateTimePicker
          mode="time"
          is24Hour={true}
          value={new Date(1970, 0, 1, note.timer / 3600000, (note.timer % 3600000) / 60000, 0)}
          minuteInterval={5}
          onChange={(e, date) => {
            if (e.type === 'set') {
              setNote({ ...note, timer: date.getHours() * 3600000 + date.getMinutes() * 60000, showPicker: false });
            } else {
              setNote({ ...note, showPicker: false });
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
            <>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalContainer} horizontal={true}>
                <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                  <Row
                    data={['Mã SV', 'Họ lót', 'Tên', 'Lớp', 'Điện thoại', 'Email']}
                    textStyle={styles.tableHeader}
                    style={{ backgroundColor: '#2596be' }}
                    widthArr={[120, 120, 60, 100, 100, 200]}
                  />
                  {students.length !== null ? (
                    <ScrollView>
                      <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                        <Rows
                          data={students.map((rowData) => [
                            rowData.ma_sinh_vien,
                            rowData.ho_lot,
                            rowData.ten,
                            rowData.ma_lop,
                            rowData.dien_thoai,
                            rowData.e_mail,
                          ])}
                          textStyle={{ textAlign: 'center' }}
                          widthArr={[120, 120, 60, 100, 100, 200]}
                        />
                      </Table>
                    </ScrollView>
                  ) : (
                    <Row data={['Không tìm thấy dữ liệu']} textStyle={{ textAlign: 'center' }} />
                  )}
                </Table>
              </ScrollView>
              <Button title="Đóng X" onPress={() => setModalVisible(false)} color="#cc0000"></Button>
            </>
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
          ) : modal === 'note' ? (
            <View style={{ padding: 10 }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  borderRadius: 4,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 28, color: '#000', marginBottom: 10, borderBottomWidth: 1 }}>Ghi chú</Text>
                <TextInput
                  multiline
                  value={note.content}
                  onChangeText={(text) => setNote({ ...note, content: text })}
                  style={{ borderRadius: 4, borderWidth: 1, maxHeight: 100, marginVertical: 10 }}
                />
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Text style={{ flex: 1 }}>Màu</Text>
                  {colors.map((color, index) => (
                    <TouchableOpacity
                      onPress={() => setNote({ ...note, color: index })}
                      style={{ backgroundColor: color, flex: 1, height: 30, borderWidth: index === note.color ? 1 : 0 }}
                    ></TouchableOpacity>
                  ))}
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <Text style={{ flex: 1 }}>Thông báo</Text>
                  <Text
                    style={{ fontSize: 28, color: note.notified ? '#000' : '#9d9d9d', flex: 1 }}
                    onPress={() => {
                      if (note.notified) setNote({ ...note, showPicker: true });
                    }}
                  >
                    {`00${Math.floor(note.timer / 3600000)}`.substring(
                      `00${Math.floor(note.timer / 3600000)}`.length - 2,
                    )}
                    :
                    {`00${Math.floor((note.timer % 3600000) / 60000)}`.substring(
                      `00${Math.floor((note.timer % 3600000) / 60000)}`.length - 2,
                    )}
                  </Text>
                  <Switch
                    style={{ flex: 1 }}
                    value={note.notified}
                    onValueChange={(value) => setNote({ ...note, notified: value })}
                  />
                </View>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#30cc00',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    marginRight: 2,
                  }}
                  onPress={handleSavingNote}
                >
                  <Text style={{ color: '#fff' }}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#cc0000',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    marginLeft: 2,
                  }}
                  onPress={handleDeletingNote}
                >
                  <Text style={{ color: '#fff' }}>Xóa</Text>
                </TouchableOpacity>
              </View>
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
                    {rowData.ma_phong.split('-').length === 4
                      ? `${rowData.ma_phong.split('-')[0]}-${rowData.ma_phong.split('-')[1]}`
                      : rowData.ma_phong.split('-')[0]}
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
                  <Text
                    onPress={() => {
                      setModal('note');
                      setModalVisible(true);
                      setNote({
                        ...note,
                        scheduleId: `${rowData.ngay_hoc}_${rowData.tiet_bat_dau}`,
                        content: rowData.note?.note || '',
                        color: colors.find((color) => color === rowData.note?.color)
                          ? colors.findIndex((color) => color === rowData.note?.color)
                          : 0,
                        notified: rowData.note?.notified || false,
                        timer: rowData.note?.timer || NOTIFICATION_TIMER.SCHEDULE,
                      });
                    }}
                    style={rowData.note?.color ? { color: rowData.note.color } : null}
                  >
                    <MaterialIcons name="speaker-notes" color="#2596be" />
                    {'\t'}
                    {rowData.note ? rowData.note.note : 'Ghi chú'}
                  </Text>
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
