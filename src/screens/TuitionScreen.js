import React from 'react';
import { View, Dimensions, Button, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, Row, TableWrapper, Cell, Col } from 'react-native-table-component';
import Modal from 'react-native-modal';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import { Context } from '../utils/context';
import styles from '../themes/screens/TuitionScreen';
import dropdownStyles from '../themes/components/DropDown';
import tuitionAPIs from '../apis/Tuition';
import { ScrollView } from 'react-native-gesture-handler';

const allSemesterWidthArr = [136, 102, 102, 40];
const selectedSemesterWidthArr = [136, 36, 84, 84, 40];
const ds_da_thu_width_arr = [176, 102, 102];

const TuitionScreen = () => {
  const [context, setContext] = React.useContext(Context);
  const [tuitions, setTuitions] = React.useState(null);

  //semester
  const [semesters, setSemesters] = React.useState([]);
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  //modal
  const [allSemesterModalVisible, setAllSemesterModalVisible] = React.useState(false);
  const [selectedSemesterModal, setSelectedSemesterModal] = React.useState(null);
  const [selectedSemesterModalVisible, setSelectedSemesterModalVisible] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState(null);

  React.useEffect(() => {
    getSemesters();
  }, []);

  const getSemesters = async () => {
    const result = await tuitionAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters([{ ten_hoc_ky: 'Tất cả học kỳ', hoc_ky: 'all' }, ...result.data.ds_hoc_ky]);
    }
  };

  React.useEffect(() => {
    getTuitions();
  }, [selectedSemester]);

  const getTuitions = async () => {
    const result = await tuitionAPIs.getTuitions(context.token, selectedSemester);
    if (result.code === 200) {
      if (selectedSemester === 'all') {
        setTuitions({ ds_hoc_phi: result.data.ds_hoc_phi_hoc_ky });
      } else {
        setTuitions({ ds_phai_thu: result.data.ds_phai_thu, ds_da_thu: result.data.ds_da_thu });
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        style={{ margin: 0 }}
        isVisible={allSemesterModalVisible}
        children={
          selectedSemesterModal !== null ? (
            <View style={styles.modalContainer}>
              <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                <TableWrapper style={{ flexDirection: 'row' }}>
                  <Col
                    data={['Học kỳ', 'Học phí', 'Miễn giảm', 'Phải thu', 'Đã thu', 'Còn nợ']}
                    textStyle={styles.tableHeader}
                    style={{ backgroundColor: '#2596be' }}
                    width={88}
                    heightArr={[30, 30, 30, 30, 30, 30]}
                  />
                  <Col
                    data={[
                      selectedSemesterModal.ten_hoc_ky,
                      Number(selectedSemesterModal.hoc_phi).toLocaleString('en-US'),
                      Number(selectedSemesterModal.mien_giam).toLocaleString('en-US'),
                      Number(selectedSemesterModal.phai_thu).toLocaleString('en-US'),
                      Number(selectedSemesterModal.da_thu).toLocaleString('en-US'),
                      Number(selectedSemesterModal.con_no).toLocaleString('en-US'),
                    ]}
                    textStyle={{ textAlign: 'center' }}
                    heightArr={[30, 30, 30, 30, 30, 30]}
                  />
                </TableWrapper>
              </Table>
              <Button title="Đóng X" onPress={() => setAllSemesterModalVisible(false)} color="#cc0000"></Button>
            </View>
          ) : (
            <View></View>
          )
        }
      ></Modal>
      <Modal
        style={{ margin: 0 }}
        isVisible={selectedSemesterModalVisible}
        children={
          selectedSubject !== null ? (
            <View style={styles.modalContainer}>
              <Table borderStyle={{ borderWidth: 1 }} style={styles.modalTable}>
                <TableWrapper style={{ flexDirection: 'row' }}>
                  <Col
                    data={['Mã môn', 'Diễn giải', 'Số TC', 'Học phí', 'Học lại', 'Miễn giảm', 'Phải thu']}
                    textStyle={styles.tableHeader}
                    style={{ backgroundColor: '#2596be' }}
                    width={88}
                    heightArr={[30, 30, 30, 30, 30, 30, 30]}
                  />
                  <Col
                    data={[
                      selectedSubject.ma_mon,
                      selectedSubject.dien_giai,
                      Number(selectedSubject.so_tin_chi_hp).toLocaleString('en-US'),
                      Number(selectedSubject.hoc_phi).toLocaleString('en-US'),
                      selectedSubject.is_hoc_lai === 'true' ? (
                        <View style={{ display: 'flex', alignItems: 'center' }}>
                          <Entypo name="check" size={16} color="green" />
                        </View>
                      ) : (
                        <View style={{ display: 'flex', alignItems: 'center' }}>
                          <Entypo name="cross" size={16} color="red" />
                        </View>
                      ),
                      Number(selectedSubject.mien_giam).toLocaleString('en-US'),
                      Number(selectedSubject.phai_thu).toLocaleString('en-US'),
                    ]}
                    textStyle={{ textAlign: 'center' }}
                    heightArr={[30, 30, 30, 30, 30, 30, 30]}
                  />
                </TableWrapper>
              </Table>
              <Button title="Đóng X" onPress={() => setSelectedSemesterModalVisible(false)} color="#cc0000"></Button>
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
      <ScrollView>
          {tuitions
            ? selectedSemester === 'all'
              ? tuitions.ds_hoc_phi?.length && (
                  <View style={{ ...styles.contentContainer, top: 70, marginBottom: 70 }}>
                    <Table borderStyle={{ borderWidth: 1 }}>
                      <Row
                        data={['Học kỳ', 'Học phí', 'Còn nợ', '']}
                        widthArr={allSemesterWidthArr}
                        textStyle={styles.tableHeader}
                        style={{ backgroundColor: '#2596be' }}
                      />
                      {tuitions.ds_hoc_phi
                        .map((hoc_ky) => [hoc_ky.ten_hoc_ky, hoc_ky.hoc_phi, hoc_ky.con_no, ''])
                        .map((rowData, index) => (
                          <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                            {rowData.map((cellData, cellIndex) => (
                              <Cell
                                key={cellIndex}
                                data={
                                  cellIndex === 0 ? (
                                    cellData
                                  ) : cellIndex === rowData.length - 1 ? (
                                    <Fontisto
                                      name="nav-icon-list-a"
                                      size={16}
                                      onPress={() => {
                                        setSelectedSemesterModal(tuitions.ds_hoc_phi[index]);
                                        setAllSemesterModalVisible(true);
                                      }}
                                    />
                                  ) : (
                                    Number(cellData).toLocaleString('en-US')
                                  )
                                }
                                textStyle={cellIndex === 0 ? { textAlign: 'left' } : { textAlign: 'right' }}
                                style={
                                  cellIndex === allSemesterWidthArr.length - 1
                                    ? {
                                        width: allSemesterWidthArr[cellIndex],
                                        padding: 5,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }
                                    : { width: allSemesterWidthArr[cellIndex], padding: 5 }
                                }
                              />
                            ))}
                          </TableWrapper>
                        ))}
                      <TableWrapper style={{ flexDirection: 'row' }}>
                        {tuitions.ds_hoc_phi
                          .reduce(
                            (result, hoc_ky) => [
                              'Tổng cộng',
                              Number(result[1]) + Number(hoc_ky.hoc_phi),
                              Number(result[2]) + Number(hoc_ky.con_no),
                              '',
                            ],
                            ['Tổng cộng', 0, 0, ''],
                          )
                          .map((cellData, cellIndex) => (
                            <Cell
                              key={cellIndex}
                              data={
                                cellIndex === 0 || cellIndex === allSemesterWidthArr.length - 1
                                  ? cellData
                                  : Number(cellData).toLocaleString('en-US')
                              }
                              textStyle={
                                cellIndex === 0
                                  ? { textAlign: 'left' }
                                  : cellIndex === allSemesterWidthArr.length - 1
                                  ? { textAlign: 'center' }
                                  : { textAlign: 'right' }
                              }
                              style={{ width: allSemesterWidthArr[cellIndex], padding: 5 }}
                            />
                          ))}
                      </TableWrapper>
                    </Table>
                  </View>
                )
              : tuitions.ds_phai_thu?.length && (
                  <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.tableTitle}>Danh sách phải thu</Text>
                    </View>
                    <Table borderStyle={{ borderWidth: 1 }} style={{ overFlow: 'scroll' }}>
                      <Row
                        data={['Môn học', 'TC', 'Học phí', 'Phải thu', '']}
                        widthArr={selectedSemesterWidthArr}
                        textStyle={styles.tableHeader}
                        style={{ backgroundColor: '#2596be' }}
                      />
                      {tuitions.ds_phai_thu
                        .map((mon) => [mon.dien_giai, mon.so_tin_chi_hp, mon.hoc_phi, mon.phai_thu, ''])
                        .map((rowData, index) => (
                          <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                            {rowData.map((cellData, cellIndex) => (
                              <Cell
                                key={cellIndex}
                                data={
                                  cellIndex === 0 ? (
                                    cellData
                                  ) : cellIndex === rowData.length - 1 ? (
                                    <Fontisto
                                      name="nav-icon-list-a"
                                      size={16}
                                      onPress={() => {
                                        setSelectedSubject(tuitions.ds_phai_thu[index]);
                                        setSelectedSemesterModalVisible(true);
                                      }}
                                    />
                                  ) : (
                                    Number(cellData).toLocaleString('en-US')
                                  )
                                }
                                textStyle={cellIndex === 0 ? { textAlign: 'left' } : { textAlign: 'right' }}
                                style={
                                  cellIndex === selectedSemesterWidthArr.length - 1
                                    ? {
                                        width: selectedSemesterWidthArr[cellIndex],
                                        padding: 5,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }
                                    : { width: selectedSemesterWidthArr[cellIndex], padding: 5 }
                                }
                              />
                            ))}
                          </TableWrapper>
                        ))}
                      <TableWrapper style={{ flexDirection: 'row' }}>
                        {tuitions.ds_phai_thu
                          .reduce(
                            (result, mon) => [
                              'Tổng cộng',
                              Number(result[1]) + Number(mon.so_tin_chi_hp),
                              Number(result[2]) + Number(mon.hoc_phi),
                              Number(result[3]) + Number(mon.phai_thu),
                              '',
                            ],
                            ['Tổng cộng', 0, 0, 0, ''],
                          )
                          .map((cellData, cellIndex) => (
                            <Cell
                              key={cellIndex}
                              data={
                                cellIndex === 0 || cellIndex === selectedSemesterWidthArr.length - 1
                                  ? cellData
                                  : Number(cellData).toLocaleString('en-US')
                              }
                              textStyle={
                                cellIndex === 0
                                  ? { textAlign: 'left' }
                                  : cellIndex === selectedSemesterWidthArr.length - 1
                                  ? { textAlign: 'center' }
                                  : { textAlign: 'right' }
                              }
                              style={{ width: selectedSemesterWidthArr[cellIndex], padding: 5 }}
                            />
                          ))}
                      </TableWrapper>
                    </Table>
                  </View>
                )
            : null}

          {tuitions && tuitions.ds_da_thu?.length && (
            <View style={{ ...styles.contentContainer, top: -50, marginBottom: -50 }}>
              <View style={styles.titleContainer}>
                <Text style={styles.tableTitle}>Danh sách đã thu</Text>
              </View>
              <Table borderStyle={{ borderWidth: 1 }} style={{ overFlow: 'scroll' }}>
                <Row
                  data={['Môn học', 'Đã thu', 'Ngày thu']}
                  widthArr={ds_da_thu_width_arr}
                  textStyle={styles.tableHeader}
                  style={{ backgroundColor: '#2596be' }}
                />
                {tuitions.ds_da_thu
                  .map((mon) => [mon.dien_giai, mon.da_thu, mon.ngay_thu])
                  .map((rowData, index) => (
                    <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                      {rowData.map((cellData, cellIndex) => (
                        <Cell
                          key={cellIndex}
                          data={cellIndex === 1 ? Number(cellData).toLocaleString('en-US') : cellData}
                          textStyle={cellIndex === 0 ? { textAlign: 'left' } : { textAlign: 'right' }}
                          style={
                            cellIndex === rowData.length - 1
                              ? {
                                  width: ds_da_thu_width_arr[cellIndex],
                                  padding: 5,
                                  display: 'flex',
                                  alignItems: 'center',
                                }
                              : { width: ds_da_thu_width_arr[cellIndex], padding: 5 }
                          }
                        />
                      ))}
                    </TableWrapper>
                  ))}
                <TableWrapper style={{ flexDirection: 'row' }}>
                  {tuitions.ds_da_thu
                    .reduce(
                      (result, mon) => ['Tổng cộng', Number(result[1]) + Number(mon.da_thu), ''],
                      ['Tổng cộng', 0, ''],
                    )
                    .map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={cellIndex === 1 ? Number(cellData).toLocaleString('en-US') : cellData}
                        textStyle={cellIndex === 0 ? { textAlign: 'left' } : { textAlign: 'right' }}
                        style={{ width: ds_da_thu_width_arr[cellIndex], padding: 5 }}
                      />
                    ))}
                </TableWrapper>
              </Table>
            </View>
          )}
      </ScrollView>
    </View>
  );
};

export default TuitionScreen;
