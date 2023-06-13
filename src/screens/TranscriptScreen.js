import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Button } from 'react-native';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo'
import Modal from 'react-native-modal';
import { Context } from '../utils/context';
import DropDownPicker from 'react-native-dropdown-picker';
import transcriptAPIs from '../apis/Transcript';
import styles from '../themes/screens/TranscriptScreen';
import dropdownStyles from '../themes/components/DropDown';

const header = ['Môn học', 'Số TC', 'TK(10)', 'KQ', ''];
const widthArr = [200, 48, 48, 48, 40];

const TranscriptScreen = () => {
  const windowWidth = Dimensions.get('window').width;
  const [context, setContext] = React.useContext(Context);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [transcript, setTranscript] = React.useState(null);

  //semester
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  const [selectedSubject, setSelectedSubject] = React.useState([]);

  React.useEffect(() => {
    getTranscripts();
  }, []);

  const getTranscripts = async () => {
    const result = await transcriptAPIs.getTranscripts(context.token);
    if (result.code === 200) {
      setData(result.data.ds_diem_hocky);
      setSelectedSemester(0);
    }
  };

  React.useEffect(() => {
    setTranscript(data[selectedSemester]);
  }, [data, selectedSemester]);

  return (
    <View style={{ flex: 1 }}>
      <Modal
        style={{ margin: 0 }}
        isVisible={modalVisible}
        children={
          selectedSubject.length > 0 ? (
            <View style={styles.modalContainer}>
              <Table borderStyle={{ borderWidth: 1 }} style={{ backgroundColor: '#fff' }}>
                <Row
                  data={['Tên thành phần', 'Trọng số (%)', 'Điểm thành phần']}
                  widthArr={[120, 120, 120]}
                  textStyle={styles.tableHeader}
                  style={{ backgroundColor: '#2596be' }}
                />
                <Rows
                  data={selectedSubject.map((rowData) => [
                    rowData.ten_thanh_phan,
                    rowData.trong_so,
                    rowData.diem_thanh_phan,
                  ])}
                  textStyle={{ textAlign: 'center' }}
                  widthArr={[120, 120, 120]}
                />
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
          items={data.map((hoc_ky, index) => {
            return { label: hoc_ky.ten_hoc_ky, value: index };
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
                .map((mon) => [mon.ten_mon, mon.so_tin_chi, mon.diem_tk, mon.ket_qua, ''])
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
                                setSelectedSubject(transcript.ds_diem_mon_hoc[index].ds_diem_thanh_phan);
                              }}
                            />
                          ) : cellIndex === rowData.length - 2 ? (
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
        </View>
      ) : null}
    </View>
  );
};

export default TranscriptScreen;
