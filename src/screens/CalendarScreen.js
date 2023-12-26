import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ExpandableCalendar, TimelineList, CalendarProvider, CalendarUtils } from 'react-native-calendars';
import ReactNativeModal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import studyScheduleAPIs from '../apis/StudySchedule';
import { Context } from '../utils/context';
import { USER_ROLE } from '../common/constant';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import scheduleNoteApis from '../apis/ScheduleNote';
import { merge } from '../utils/functions';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

const menuTopMargin = -Dimensions.get('screen').height * 0.5 + 100;
const colors = [
  {
    value: '#ff0000',
    label: 'Đỏ',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#ff0000' }}></View>,
  },
  {
    value: '#ff6f00',
    label: 'Cam',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#ff6f00' }}></View>,
  },
  {
    value: '#f6ff00',
    label: 'Vàng',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#f6ff00' }}></View>,
  },
  {
    value: '#00ff04',
    label: 'Lục',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#00ff04' }}></View>,
  },
  {
    value: '#0084ff',
    label: 'Lam',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#0084ff' }}></View>,
  },
  {
    value: '#aa00ff',
    label: 'Tím',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#aa00ff' }}></View>,
  },
  {
    value: '#ff0073',
    label: 'Hồng',
    image: <View style={{ height: 16, width: 16, backgroundColor: '#ff0073' }}></View>,
  },
];
const initialState = {
  isFixed: false,
  title: '',
  summary: '',
  start: '',
  end: '',
  color: '',
  room: '',
  time: '',
  lecturer: '',
  note: '',
  numberOfLessons: '',
  id: '',
};

const CalendarScreen = () => {
  const [context, setContext] = React.useContext(Context);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [openModal, setOpenModal] = React.useState(false);
  const [semesters, setSemesters] = React.useState([]);
  const [selectedSemester, setSelectedSemester] = React.useState(null);
  const [schedule, setSchedule] = React.useState({});
  const [eventData, setEventData] = React.useState(initialState);
  const [marked, setMarked] = React.useState({});
  const [dateTimePicker, setDateTimePicker] = React.useState('');
  const [notes, setNotes] = React.useState({});
  const [scheduleNotes, setScheduleNotes] = React.useState([]);

  const onDateChanged = (date, source) => {
    console.log('TimelineCalendarScreen onDateChanged: ', date, source);
    setCurrentDate(date);
  };

  const onMonthChange = (month, updateSource) => {
    console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
    setCurrentDate(month.dateString);
  };

  const createNewEvent = async () => {
    if (!eventData.title || !eventData.summary || !eventData.start || !eventData.end || !eventData.color) {
      return Alert.alert('Sorry', 'Bạn chưa điền đầy đủ thông tin');
    }

    setContext({ ...context, isLoading: true });
    const start = eventData.start;
    start.setHours(start.getHours() + 7);
    const end = eventData.end;
    end.setHours(end.getHours() + 7);
    await scheduleNoteApis.create({
      ...eventData,
      userId: context.userId,
      start: start.getTime(),
      end: end.getTime(),
    });

    getNotes();
    setOpenModal(false);
    setContext({ ...context, isLoading: false });
  };

  const updateEvent = async () => {
    if (!eventData.title || !eventData.summary || !eventData.start || !eventData.end || !eventData.color) {
      return Alert.alert('Sorry', 'Bạn chưa điền đầy đủ thông tin');
    }

    setContext({ ...context, isLoading: true });
    const start = new Date(eventData.start);
    start.setHours(start.getHours() + 7);
    const end = new Date(eventData.end);
    end.setHours(end.getHours() + 7);
    await scheduleNoteApis.update(eventData.id, {
      ...eventData,
      userId: context.userId,
      start: start.getTime(),
      end: end.getTime(),
    });
    getNotes();
    setOpenModal(false);
    setContext({ ...context, isLoading: false });
  };

  const deleteEvent = async () => {
    setContext({ ...context, isLoading: true });
    await scheduleNoteApis.delete(eventData.id);
    getNotes();
    setOpenModal(false);
    setContext({ ...context, isLoading: false });
  };

  React.useEffect(() => {
    getSemesters();
    getNotes();
  }, []);

  const getSemesters = async () => {
    setContext({ ...context, isLoading: true });
    const result = await studyScheduleAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);
    }
    setContext({ ...context, isLoading: false });
  };

  const getNotes = async () => {
    setContext({ ...context, isLoading: true });

    let notes = await scheduleNoteApis.search({ userId: context.userId });
    await notes.forEach((note, index) => {
      let start = new Date(note.start).toISOString();
      start = start.split('T');
      notes[index].start = `${start[0]} ${start[1].substring(0, 8)}`;

      let end = new Date(note.end).toISOString();
      end = end.split('T');
      notes[index].end = `${end[0]} ${end[1].substring(0, 8)}`;
    });

    notes = notes.reduce((result, event) => {
      (result[CalendarUtils.getCalendarDateString(event.start)] =
        result[CalendarUtils.getCalendarDateString(event.start)] || []).push(event);

      return result;
    }, {});

    setNotes(notes);
    setContext({ ...context, isLoading: false });
  };

  const selectSemester = async () => {
    setContext({ ...context, isLoading: true });
    semesters.forEach((hoc_ky) => {
      let dateParts = hoc_ky.ngay_bat_dau_hk.split('/');
      const ngay_bat_dau_hk = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).getTime();

      dateParts = hoc_ky.ngay_ket_thuc_hk.split('/');
      const ngay_ket_thuc_hk = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).getTime();

      if (ngay_bat_dau_hk <= new Date(currentDate).getTime() && ngay_ket_thuc_hk > new Date(currentDate).getTime()) {
        setSelectedSemester(hoc_ky.hoc_ky);
      }
    });
    setContext({ ...context, isLoading: false });
  };

  React.useEffect(() => {
    selectSemester();
  }, [semesters, currentDate]);

  const getSchedule = async () => {
    setContext({ ...context, isLoading: true });
    const result = await studyScheduleAPIs.getSchedule(context.token, selectedSemester, context.userId);

    if (result.code === 200) {
      let studySchedule = [];
      let newMarked = {};
      result.data.ds_tuan_tkb.forEach((tuan) => {
        tuan.ds_thoi_khoa_bieu.forEach((buoi) => {
          const data = {
            start: `${CalendarUtils.getCalendarDateString(new Date(buoi.ngay_hoc))} ${
              result.data.ds_tiet_trong_ngay.find((e) => e.tiet === buoi.tiet_bat_dau).gio_bat_dau
            }:00`,
            end: `${CalendarUtils.getCalendarDateString(new Date(buoi.ngay_hoc))} ${result.data.ds_tiet_trong_ngay
              .find((e) => e.tiet === buoi.tiet_bat_dau + buoi.so_tiet - 1)
              .gio_ket_thuc.substring(0, 4)
              .concat('0')}:00`,
            title: `${buoi.ten_mon} - ${buoi.ma_nhom}`,
            isFixed: true,
            room: `Phòng: ${buoi.ma_phong}`,
            lecturer: context.role === USER_ROLE.student ? `Giảng viên: ${buoi.ten_giang_vien}` : '',
            numberOfLessons: `Số tiết: ${buoi.so_tiet}`,
          };
          data.summary = `${context.role === USER_ROLE.student ? `${data.lecturer}\n` : ''}${data.room}`;
          data.time = `Thời gian: ${data.start.split(' ').at(1).substring(0, 5)} - ${data.end
            .split(' ')
            .at(1)
            .substring(0, 5)}`;
          studySchedule.push(data);

          newMarked = {
            ...newMarked,
            [CalendarUtils.getCalendarDateString(new Date(buoi.ngay_hoc))]: { marked: true },
          };
        });
      });

      studySchedule = studySchedule.reduce((result, event) => {
        (result[CalendarUtils.getCalendarDateString(event.start)] =
          result[CalendarUtils.getCalendarDateString(event.start)] || []).push(event);

        return result;
      }, {});

      setMarked(newMarked);
      setSchedule(studySchedule);
    }
    setContext({ ...context, isLoading: false });
  };

  React.useEffect(() => {
    if (selectedSemester) {
      getSchedule();
      getScheduleNotes();
    }
  }, [selectedSemester]);

  const timelineProps = {
    format24h: true,
    onBackgroundLongPress: (timeString, timeObject) => {
      setEventData({ ...initialState, isFixed: false, start: new Date(timeString) });
      setOpenModal(true);
    },
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  const getScheduleNotes = async () => {
    const notes = await studyScheduleAPIs.getScheduleNotes({ userId: context.userId });
    if (!notes.error) {
      setScheduleNotes(notes);
    }
  };

  const updateScheduleNote = async () => {
    setContext({ ...context, isLoading: true });
    await studyScheduleAPIs.updateScheduleNote({
      userId: context.userId,
      scheduleId: `${eventData.title} - ${eventData.time} - ${eventData.room}`,
      text: eventData.note,
    });
    await getScheduleNotes();
    setOpenModal(false);
    setContext({ ...context, isLoading: false });
  };

  React.useEffect(() => {
    Object.entries(schedule).forEach(([key, value]) => {
      value.forEach((subject, index) => {
        const note = scheduleNotes.find(
          (note) => note.scheduleId === `${subject.title} - ${subject.time} - ${subject.room}`,
        );
        if (note) {
          schedule[key][index] = {
            ...subject,
            note: note.text,
            summary: `${context.role === USER_ROLE.student ? `${subject.lecturer}\n` : ''}${subject.room}\nGhi chú: ${
              note.text
            }`,
          };
        } else {
          schedule[key][index] = {
            ...subject,
            note: '',
            summary: `${context.role === USER_ROLE.student ? `${subject.lecturer}\n` : ''}${subject.room}`,
          };
        }
      });
    });
  }, [scheduleNotes, schedule]);

  return (
    <>
      <CalendarProvider
        date={currentDate}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton
        todayBottomMargin={10}
        disabledOpacity={0.6}
      >
        <ExpandableCalendar firstDay={1} markedDates={marked} enableSwipeMonths />
        <TimelineList
          events={merge(notes, schedule)}
          timelineProps={{
            ...timelineProps,
            onEventPress: (event) => {
              console.log(event);
              setEventData({ ...initialState, ...event });
              setOpenModal(true);
            },
            renderEvent: (event) => (
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{event.title}</Text>
                <Text style={{ fontWeight: '400', fontSize: 16 }}>{event.summary}</Text>
                <Text style={{ fontWeight: '400', fontSize: 16 }}>
                  {event.start.split(' ').at(1).substring(0, 5)} - {event.end.split(' ').at(1).substring(0, 5)}
                </Text>
              </View>
            ),
          }}
          showNowIndicator
          scrollToNow
          scrollToFirst
          initialTime={{ hour: 7, minutes: 0 }}
        />
      </CalendarProvider>
      <ReactNativeModal
        statusBarTranslucent={false}
        isVisible={openModal}
        onBackdropPress={() => setOpenModal(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        children={
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={false}
            style={{ height: '50%', backgroundColor: '#fff' }}
          >
            <MenuProvider skipInstanceCheck>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setOpenModal(false)}>
                  <MaterialCommunityIcons name="close" size={20} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000' }}>Sự kiện</Text>
                </View>
                <Menu>
                  <MenuTrigger
                    style={{ marginRight: 10 }}
                    children={<MaterialCommunityIcons name="dots-vertical" size={25} />}
                  />
                  <MenuOptions
                    customStyles={{
                      optionsContainer: { width: 150, marginLeft: -10, marginTop: menuTopMargin },
                      optionWrapper: { margin: 5 },
                      optionText: { color: '#000' },
                    }}
                  >
                    {eventData.id && (
                      <MenuOption
                        text="Xóa"
                        onSelect={() =>
                          Alert.alert('Lưu ý', 'Dữ liệu đã xóa sẽ không thể phục hồi', [
                            { text: 'Hủy', style: 'cancel' },
                            {
                              text: 'Xóa',
                              onPress: deleteEvent,
                            },
                          ])
                        }
                      />
                    )}
                  </MenuOptions>
                </Menu>
              </View>
              <View style={{ padding: 10, justifyContent: 'space-between', flex: 1 }}>
                <TextInput
                  style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 10,
                    color: '#000',
                  }}
                  placeholder="Tiêu đề"
                  editable={!eventData.isFixed}
                  onChangeText={(text) => setEventData({ ...eventData, title: text })}
                  value={eventData.title}
                />
                <TextInput
                  style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 10,
                    color: '#000',
                  }}
                  placeholder="Mô tả"
                  editable={!eventData.isFixed}
                  onChangeText={(text) => setEventData({ ...eventData, summary: text })}
                  value={eventData.isFixed ? eventData.room : eventData.summary}
                />
                <Pressable disabled={eventData.isFixed} onPress={() => setDateTimePicker('start')}>
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: 'gray',
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 10,
                      color: '#000',
                    }}
                    placeholder="Bắt đầu"
                    editable={false}
                    onPressIn={() => setDateTimePicker('start')}
                    value={eventData.isFixed ? eventData.numberOfLessons : new Date(eventData.start)?.toLocaleString()}
                  />
                </Pressable>
                <Pressable disabled={eventData.isFixed} onPress={() => setDateTimePicker('end')}>
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: 'gray',
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 10,
                      color: '#000',
                    }}
                    placeholder="Kết thúc"
                    editable={false}
                    onPressIn={() => setDateTimePicker('end')}
                    value={
                      eventData.isFixed
                        ? eventData.time
                        : eventData.end
                        ? new Date(eventData.end)?.toLocaleString()
                        : ''
                    }
                  />
                </Pressable>

                {eventData.isFixed ? (
                  <TextInput
                    style={{
                      height: 40,
                      borderColor: 'gray',
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 10,
                      color: '#000',
                    }}
                    placeholder="Ghi chú"
                    editable={true}
                    value={eventData.note}
                    onChangeText={(text) => setEventData({ ...eventData, note: text })}
                  />
                ) : (
                  <Dropdown
                    placeholder="Màu sắc"
                    data={colors}
                    labelField="label"
                    valueField="value"
                    imageField="image"
                    value={eventData.color}
                    onChange={(item) => setEventData({ ...eventData, color: item.value })}
                    style={{
                      height: 40,
                      borderColor: 'gray',
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 10,
                    }}
                    placeholderStyle={{ fontSize: 14 }}
                    selectedTextStyle={{ color: '#000', fontSize: 14 }}
                    renderLeftIcon={() =>
                      eventData.color ? (
                        <View
                          style={{ height: 16, width: 16, backgroundColor: eventData.color, marginRight: 10 }}
                        ></View>
                      ) : null
                    }
                    renderItem={(item) => (
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        {item.image}
                        <Text style={{ color: '#000', marginLeft: 10 }}>{item.label}</Text>
                      </View>
                    )}
                  />
                )}
                <View>
                  <Button
                    title="Lưu"
                    color="#30cc00"
                    onPress={() => {
                      if (eventData.isFixed) {
                        updateScheduleNote();
                      } else {
                        if (new Date(eventData.start).getTime() >= new Date(eventData.end).getTime()) {
                          return Alert.alert('Sorry', 'Hãy chọn 1 khoảng thời gian phù hợp');
                        }

                        if (eventData.id) {
                          updateEvent();
                        } else {
                          createNewEvent();
                        }
                      }
                    }}
                  />
                </View>
              </View>
            </MenuProvider>
          </KeyboardAvoidingView>
        }
      />
      {dateTimePicker.length > 0 && (
        <RNDateTimePicker
          mode="time"
          is24Hour={true}
          minuteInterval={5}
          value={
            dateTimePicker === 'start'
              ? new Date(eventData.start)
              : eventData.end
              ? new Date(eventData.end)
              : new Date(
                  eventData.start.getFullYear(),
                  eventData.start.getMonth(),
                  eventData.start.getDate(),
                  eventData.start.getHours() + 1,
                  eventData.start.getMinutes(),
                  eventData.start.getSeconds(),
                )
          }
          minimumDate={new Date(eventData.start)}
          onChange={(e, date) => {
            if (e.type === 'set') {
              setDateTimePicker('');
              setEventData({ ...eventData, [dateTimePicker]: date });
            } else {
              setDateTimePicker('');
            }
          }}
        />
      )}
    </>
  );
};

export default CalendarScreen;
