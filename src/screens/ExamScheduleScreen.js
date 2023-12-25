import React from 'react';
import { View, ScrollView, Button, TouchableOpacity, Text, Switch, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, Row, TableWrapper, Cell, Col, Rows } from 'react-native-table-component';
import Modal from 'react-native-modal';
import Fontisto from 'react-native-vector-icons/Fontisto';
import examScheduleAPIs from '../apis/ExamSchedule';
import { Context } from '../utils/context';
import styles from '../themes/screens/ExamScheduleScreen';
import dropdownStyles from '../themes/components/DropDown';
import { useIsFocused } from '@react-navigation/native';
import { USER_ROLE } from '../common/constant';

const ExamScheduleScreen = () => {
  const windowWidth = Dimensions.get('window').width;
  const tableWidth = 388;
  const widthArr = [132, 88, 72, 56, 40];
  widthArr.forEach((width, index) => (widthArr[index] = (width * windowWidth) / tableWidth));

  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [schedule, setSchedule] = React.useState([]);

  //semester
  const [semesters, setSemesters] = React.useState([]);
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  const [selectedSubject, setSelectedSubject] = React.useState(null);

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getSemesters();
    setContext({ ...context, isLoading: false });
  }, [isFocus]);

  const getSemesters = async () => {
    const result = await examScheduleAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);
      setSelectedSemester(result.data.ds_hoc_ky[0].hoc_ky);
    }
  };

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getSchedule();
    setContext({ ...context, isLoading: false });
  }, [selectedSemester]);

  const getSchedule = async () => {
    const result = await examScheduleAPIs.getSchedule(context.token, selectedSemester, context.role);
    if (result.code === 200) {
      if (context.role === USER_ROLE.student) {
        setSchedule(result.data.ds_lich_thi);
      } else {
        setSchedule(result.lich_coi_thi_can_bo.data?.ds_lich_thi);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        children={
          <>
            <View style={styles.modalContainer}>
              <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                <TableWrapper style={{ flexDirection: 'row' }}>
                  <Col
                    data={[
                      'Mã Môn',
                      'Môn thi',
                      'Sỉ số',
                      'Ngày thi',
                      'Bắt đầu',
                      'Phút',
                      'Phòng thi',
                      'Cơ sở',
                      'Hình thức thi',
                    ]}
                    textStyle={styles.tableHeader}
                    style={{ backgroundColor: '#2596be' }}
                    width={88}
                    heightArr={[30, 30, 30, 30, 30, 30, 30, 30, 30]}
                  />
                  {selectedSubject !== null ? (
                    <Col
                      data={[
                        selectedSubject.ma_mon,
                        selectedSubject.ten_mon,
                        selectedSubject.si_so,
                        selectedSubject.ngay_thi,
                        selectedSubject.gio_bat_dau,
                        selectedSubject.so_phut,
                        selectedSubject.ma_phong || selectedSubject.ghep_phong,
                        selectedSubject.ma_co_so,
                        selectedSubject.hinh_thuc_thi,
                      ]}
                      textStyle={{ textAlign: 'center' }}
                      width={300}
                      heightArr={[30, 30, 30, 30, 30, 30, 30, 30, 30]}
                    />
                  ) : (
                    <Col data={['Không tìm thấy dữ liệu']} textStyle={{ textAlign: 'center' }} heightArr={[270]} />
                  )}
                </TableWrapper>
              </Table>
            </View>
            <Button title="Đóng X" onPress={() => setModalVisible(false)} color="#cc0000"></Button>
          </>
        }
      />
      <View style={dropdownStyles.container}>
        <DropDownPicker
          open={semesterOpen}
          value={selectedSemester}
          items={semesters.map((hoc_ky) => {
            return { label: hoc_ky.ten_hoc_ky, value: hoc_ky.hoc_ky };
          })}
          setOpen={setSemesterOpen}
          setValue={setSelectedSemester}
          dropDownContainerStyle={dropdownStyles.dropDownContainer}
        />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer} horizontal={true}>
        {schedule && schedule.length > 0 ? (
          <Table borderStyle={{ borderWidth: 1 }}>
            <Row
              data={['Môn thi', 'Ngày thi', 'Phòng', 'Bắt đầu', '']}
              widthArr={widthArr}
              textStyle={styles.tableHeader}
              style={{ backgroundColor: '#2596be' }}
            />
            <ScrollView>
              {schedule
                .map((mon) => [mon.ten_mon, mon.ngay_thi, mon.ma_phong || mon.ghep_phong, mon.gio_bat_dau, ''])
                .map((rowData, index) => (
                  <TableWrapper borderStyle={{ borderWidth: 1 }} key={index} style={{ flexDirection: 'row' }}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === rowData.length - 1 ? (
                            <Fontisto
                              name="nav-icon-list-a"
                              size={16}
                              onPress={() => {
                                setSelectedSubject(schedule[index]);
                                setModalVisible(true);
                              }}
                            />
                          ) : (
                            cellData
                          )
                        }
                        textStyle={{ textAlign: 'left' }}
                        style={
                          cellIndex !== 0
                            ? {
                                width: widthArr[cellIndex],
                                padding: 5,
                                display: 'flex',
                                alignItems: 'center',
                                borderWidth: 1,
                              }
                            : { width: widthArr[cellIndex], padding: 5, borderWidth: 1 }
                        }
                      />
                    ))}
                  </TableWrapper>
                ))}
              <TableWrapper borderStyle={{ borderWidth: 1 }}>
                <Row data={[]} height={40} />
              </TableWrapper>
            </ScrollView>
          </Table>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ExamScheduleScreen;
