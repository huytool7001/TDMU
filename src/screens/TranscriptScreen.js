import React from 'react';
import { View, Text, Button, ScrollView, Dimensions } from 'react-native';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import { Context } from '../utils/context';
import DropDownPicker from 'react-native-dropdown-picker';
import transcriptAPIs from '../apis/Transcript';
import styles from '../themes/screens/TranscriptScreen';
import dropdownStyles from '../themes/components/DropDown';
import { useIsFocused } from '@react-navigation/native';
import { USER_ROLE } from '../common/constant';
import TeacherTransciptList from '../components/TeacherTransciptList';

const TranscriptScreen = () => {
  const [context, setContext] = React.useContext(Context);

  const windowWidth = Dimensions.get('window').width;
  const tableWidth = 384;
  const widthArr = context.role === USER_ROLE.student ? [200, 48, 48, 48, 40] : [196, 92, 48, 48];
  widthArr.forEach((width, index) => (widthArr[index] = (width * windowWidth) / tableWidth));

  const header = ['Môn học', 'Số TC', 'TK(10)', 'KQ', ''];
  const modalHeader = ['Tên thành phần', 'Trọng số (%)', 'Điểm thành phần'];
  const modalWidthArr = [120, 120, 120];
  modalWidthArr.forEach((width, index) => (modalWidthArr[index] = (width * windowWidth) / tableWidth));

  const isFocus = useIsFocused();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [transcript, setTranscript] = React.useState(null);

  //semester
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  const [selectedSubject, setSelectedSubject] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, [isFocus]);

  const getData = async () => {
    if (context.role === USER_ROLE.student) {
      const result = await transcriptAPIs.getTranscripts(context.token);
      if (result.code === 200) {
        setData(result.data.ds_diem_hocky);
        setSelectedSemester(0);
      }
    } else {
      const semester = await transcriptAPIs.getSemesters(context.token);
      if (semester.code === 200) {
        setData(semester.data.ds_hoc_ky);
        setSelectedSemester(semester.data.ds_hoc_ky[0].hoc_ky);
      }
    }
  };

  const getTranscripts = async () => {
    const result = await transcriptAPIs.getTranscripts(context.token, selectedSemester, context.role);
    if (result.code === 200) {
      setTranscript({ ds_diem_mon_hoc: result.data.ds_nhom_to });
    }
  };

  React.useEffect(() => {
    if (context.role == USER_ROLE.student) {
      setTranscript(data[selectedSemester]);
    } else {
      getTranscripts();
    }
  }, [data, selectedSemester]);

  const getStudents = async (id) => {
    const result = await transcriptAPIs.getStudents(context.token, id);
    if (result.code === 200) {
      setSelectedSubject(result.data.ds_sinh_vien);
      setModalVisible(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        children={
          context.role === USER_ROLE.teacher ? (
            <TeacherTransciptList data={selectedSubject} />
          ) : (
            <>
              <ScrollView horizontal={true} style={{ flex: 1 }} contentContainerStyle={styles.modalContainer}>
                <View>
                  <Table borderStyle={{ borderWidth: 1 }} style={{ backgroundColor: '#fff' }}>
                    <Row
                      data={modalHeader}
                      widthArr={modalWidthArr}
                      textStyle={styles.tableHeader}
                      style={{ backgroundColor: '#2596be' }}
                    />
                    {selectedSubject.length > 0 ? (
                      <ScrollView>
                        <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                          <Rows
                            data={selectedSubject.map((rowData) => [
                              rowData.ten_thanh_phan,
                              rowData.trong_so,
                              rowData.diem_thanh_phan,
                            ])}
                            textStyle={{ textAlign: 'center' }}
                            widthArr={modalWidthArr}
                          />
                        </Table>
                      </ScrollView>
                    ) : (
                      <Row data={['Không tìm thấy dữ liệu']} textStyle={styles.notFoundText} />
                    )}
                  </Table>
                </View>
              </ScrollView>
              <Button title="Đóng X" onPress={() => setModalVisible(false)} color="#cc0000"></Button>
            </>
          )
        }
      ></Modal>
      <View style={dropdownStyles.container}>
        <DropDownPicker
          open={semesterOpen}
          value={selectedSemester}
          items={data.map((hoc_ky, index) => {
            return { label: hoc_ky.ten_hoc_ky, value: context.role === USER_ROLE.student ? index : hoc_ky.hoc_ky };
          })}
          setOpen={setSemesterOpen}
          setValue={setSelectedSemester}
          dropDownContainerStyle={dropdownStyles.dropDownContainer}
        />
      </View>
      {transcript && transcript.ds_diem_mon_hoc.length > 0 ? (
        <View style={styles.contentContainer}>
          <View style={{ alignItems: 'center' }}>
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row
                data={header}
                widthArr={widthArr}
                textStyle={{ fontWeight: 'bold', textAlign: 'center' }}
                style={{ backgroundColor: '#2596be' }}
              />
              {transcript.ds_diem_mon_hoc
                .map((mon) =>
                  context.role === USER_ROLE.student
                    ? [mon.ten_mon, mon.so_tin_chi, mon.diem_tk, mon.ket_qua, '']
                    : [mon.ten_mon, mon.nhom_to, mon.sl_dk, ''],
                )
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
                                if (context.role === USER_ROLE.student) {
                                  setSelectedSubject(transcript.ds_diem_mon_hoc[index].ds_diem_thanh_phan);
                                  setModalVisible(true);
                                } else {
                                  getStudents(transcript.ds_diem_mon_hoc[index].id_to_hoc);
                                }
                              }}
                            />
                          ) : context.role === USER_ROLE.student && cellIndex === rowData.length - 2 ? (
                            cellData === 1 ? (
                              <Entypo name="check" size={16} color="green" />
                            ) : (
                              <Entypo name="cross" size={16} color="red" />
                            )
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
          </View>
          {context.role === USER_ROLE.student && (
            <View style={styles.bottomSectionContainer}>
              <View style={styles.flexRow}>
                <View style={styles.flex2}>
                  <Text>Điểm trung bình học kỳ hệ 10: </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text>{transcript.dtb_hk_he10}</Text>
                </View>
              </View>
              <View style={styles.flexRow}>
                <View style={styles.flex2}>
                  <Text>Điểm trung bình tích lũy hệ 10: </Text>
                </View>
                <View style={styles.flex1End}>
                  <Text>{transcript.dtb_tich_luy_he_10}</Text>
                </View>
              </View>
              <View style={styles.flexRow}>
                <View style={styles.flex2}>
                  <Text>Số tín chỉ đạt học kỳ: </Text>
                </View>
                <View style={styles.flex1End}>
                  <Text>{transcript.so_tin_chi_dat_hk}</Text>
                </View>
              </View>
              <View style={styles.flexRow}>
                <View style={styles.flex2}>
                  <Text>Số tín chỉ tích lũy: </Text>
                </View>
                <View style={styles.flex1End}>
                  <Text>{transcript.so_tin_chi_dat_tich_luy}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default TranscriptScreen;
