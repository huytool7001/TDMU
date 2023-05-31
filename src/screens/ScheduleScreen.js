import * as React from 'react';
import { View, Text, Dimensions, FlatList, ScrollView } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import scheduleAPIs from '../apis/schedule';
import { Context } from '../utils/context';
import DropDownPicker from 'react-native-dropdown-picker';

const ScheduleScreen = () => {
  const windowWidth = Dimensions.get('window').width;
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

  const onSemesterOpen = React.useCallback(() => {
    setWeekOpen(false);
  }, []);

  const onWeekOpen = React.useCallback(() => {
    setSemesterOpen(false);
  }, []);

  React.useEffect(() => {
    getSemesters();
  }, []);

  React.useEffect(() => {
    getSchedule();
  }, [selectedSemester]);

  React.useEffect(() => {
    if (data) {
      let result = data.ds_tuan_tkb[selectedWeek].ds_thoi_khoa_bieu.reduce((accumulator, currentValue) => {
        (accumulator[currentValue['ngay_hoc']] = accumulator[currentValue['ngay_hoc']] || []).push(currentValue);
        return accumulator;
      }, {});

      result = Object.keys(result).map((key) => {
        return { day: key, data: result[key] };
      });

      setSchedule(result);
    }
  }, [selectedWeek, data]);

  const getSemesters = async () => {
    const result = await scheduleAPIs.getSemesters(context.token);
    console.log(result)
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);
    }
  };

  const getSchedule = async () => {
    const result = await scheduleAPIs.getSchedule(context.token, selectedSemester);

    setData(result.data);
    setSelectedWeek(0);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', paddingHorizontal: 5, maxWidth: windowWidth, zIndex: 3 }}>
        <DropDownPicker
          open={semesterOpen}
          value={selectedSemester}
          items={semesters.map((hoc_ky) => {
            return { label: hoc_ky.ten_hoc_ky, value: hoc_ky.hoc_ky };
          })}
          setOpen={setSemesterOpen}
          setValue={setSelectedSemester}
          onOpen={onSemesterOpen}
          dropDownContainerStyle={{ top: 0, position: 'relative', height: 400 }}
        />
      </View>
      {data && data.ds_tuan_tkb?.length && (
        <View style={{ position: 'absolute', top: 50, paddingHorizontal: 5, maxWidth: windowWidth, zIndex: 2 }}>
          <DropDownPicker
            open={weekOpen}
            value={selectedWeek}
            items={data.ds_tuan_tkb.map((tuan, index) => {
              return { label: tuan.thong_tin_tuan, value: index };
            })}
            setOpen={setWeekOpen}
            setValue={setSelectedWeek}
            onOpen={onWeekOpen}
            dropDownContainerStyle={{ top: 0, position: 'relative', height: 400 }}
          />
        </View>
      )}

      <FlatList
        style={{ top: 100, marginBottom: 100 }}
        data={schedule}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>
              {new Date(item.day).toLocaleDateString('en-US', {
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
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{rowData.ten_mon}</Text>
                  <Text>
                    <MaterialIcons name="people-alt" color="#2596be" />
                    {'\t'}
                    {rowData.ten_giang_vien}
                  </Text>
                  <Text>
                    <MaterialIcons name="place" color="#2596be" />
                    {'\t'}
                    {rowData.ma_phong.slice(0, rowData.ma_phong.indexOf('-', rowData.ma_phong.indexOf('-') + 1))}
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
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ScheduleScreen;
