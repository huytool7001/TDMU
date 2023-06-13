import React from 'react';
import { View, Dimensions, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component';
import Modal from 'react-native-modal';
import Fontisto from 'react-native-vector-icons/Fontisto';
import examScheduleAPIs from '../apis/ExamSchedule';
import { Context } from '../utils/context';
import styles from '../themes/screens/ExamScheduleScreen';
import dropdownStyles from '../themes/components/DropDown'

const widthArr = [200, 88, 56, 40];

const ExamScheduleScreen = () => {
  const [context, setContext] = React.useContext(Context);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [schedule, setSchedule] = React.useState([]);

  //semester
  const [semesters, setSemesters] = React.useState([]);
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  const [selectedSubject, setSelectedSubject] = React.useState(null);

  React.useEffect(() => {
    getSemesters();
  }, []);

  const getSemesters = async () => {
    const result = await examScheduleAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);
      setSelectedSemester(result.data.ds_hoc_ky[0].hoc_ky);
    }
  };

  React.useEffect(() => {
    getSchedule();
  }, [selectedSemester]);

  const getSchedule = async () => {
    const result = await examScheduleAPIs.getSchedule(context.token, selectedSemester);
    if (result.code === 200) {
      setSchedule(result.data.ds_lich_thi);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        style={{ margin: 0 }}
        isVisible={modalVisible}
        children={
          selectedSubject !== null ? (
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
                    heightArr={[30, 30, 30, 30, 30, 30, 30, 30, 30]}
                  />
                </TableWrapper>
              </Table>
              <Button title="Đóng X" onPress={() => setModalVisible(false)} color="#cc0000"></Button>
            </View>
          ) : (
            <View></View>
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
          dropDownContainerStyle={dropdownStyles.dropDownContainer}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={{ alignItems: 'center' }}>
          {schedule && schedule.length > 0 ? (
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row
                data={['Môn thi', 'Ngày thi', 'Bắt đầu', '']}
                widthArr={[200, 88, 56, 40]}
                textStyle={styles.tableHeader}
                style={{ backgroundColor: '#2596be' }}
              />
              {schedule
                .map((mon) => [mon.ten_mon, mon.ngay_thi, mon.gio_bat_dau, ''])
                .map((rowData, index) => (
                  <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === rowData.length - 1 ? (
                            <Fontisto
                              name="nav-icon-list-a"
                              size={16}
                              onPress={() => {
                                setModalVisible(true);
                                setSelectedSubject(schedule[index]);
                              }}
                            />
                          ) : (
                            cellData
                          )
                        }
                        textStyle={{ textAlign: 'left' }}
                        style={
                          cellIndex !== 0
                            ? { width: widthArr[cellIndex], padding: 5, display: 'flex', alignItems: 'center' }
                            : { width: widthArr[cellIndex], padding: 5 }
                        }
                      />
                    ))}
                  </TableWrapper>
                ))}
            </Table>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ExamScheduleScreen;
