import React from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import studyScheduleAPIs from '../apis/StudySchedule';
import { Context } from '../utils/context';
import styles from '../themes/screens/StudyScheduleScreen';
import dropdownStyles from '../themes/components/DropDown';

const StudyScheduleScreen = () => {
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

  React.useEffect(() => {
    getSemesters();
  }, []);

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
    getSchedule();
  }, [selectedSemester]);

  const getSchedule = async () => {
    const result = await studyScheduleAPIs.getSchedule(context.token, selectedSemester);

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

  React.useEffect(() => {
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
  }, [selectedWeek, data]);

  const onSemesterOpen = React.useCallback(() => {
    setWeekOpen(false);
  }, []);

  const onWeekOpen = React.useCallback(() => {
    setSemesterOpen(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
                  <Text style={styles.textSubjectName}>{rowData.ten_mon}</Text>
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

export default StudyScheduleScreen;
