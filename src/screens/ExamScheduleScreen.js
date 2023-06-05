import * as React from 'react';
import { View, Text, Dimensions, ScrollView, Image } from 'react-native';
import examScheduleAPIs from '../apis/ExamSchedule';
import { Context } from '../utils/context';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, Row, Rows, TableWrapper, Cell } from 'react-native-table-component';

const header = ['Môn thi', 'Ngày thi', 'Bắt đầu', 'Phút', 'Phòng thi', 'Hình thức thi'];
const widthArr = [200, 88, 60, 48, 80, 160];

const ExamScheduleScreen = () => {
  const windowWidth = Dimensions.get('window').width;
  const [context, setContext] = React.useContext(Context);
  const [schedule, setSchedule] = React.useState([]);

  //semester
  const [semesters, setSemesters] = React.useState([]);
  const [semesterOpen, setSemesterOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(null);

  React.useEffect(() => {
    getSemesters();
  }, []);

  React.useEffect(() => {
    getSchedule();
  }, [selectedSemester]);

  const getSemesters = async () => {
    const result = await examScheduleAPIs.getSemesters(context.token);
    if (result.code === 200) {
      setSemesters(result.data.ds_hoc_ky);
      setSelectedSemester(result.data.ds_hoc_ky[0].hoc_ky);
    }
  };

  const getSchedule = async () => {
    const result = await examScheduleAPIs.getSchedule(context.token, selectedSemester);
    if (result.code === 200) {
      setSchedule(result.data.ds_lich_thi);
    }
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
          dropDownContainerStyle={{ top: 0, position: 'relative', height: 400 }}
        />
      </View>
      <View style={{ top: 100, marginBottom: 100 }}>
        <ScrollView horizontal={true}>
          {schedule && schedule.length ? (
            <Table borderStyle={{ borderWidth: 1 }}>
              <Row
                data={header}
                widthArr={widthArr}
                textStyle={{ fontWeight: 'bold', textAlign: 'center' }}
                style={{ backgroundColor: '#2596be' }}
              />
              {schedule
                .map((mon) => [
                  mon.ten_mon,
                  mon.ngay_thi,
                  mon.gio_bat_dau,
                  mon.so_phut,
                  mon.ma_phong || mon.ghep_phong,
                  mon.ghi_chu_htt,
                ])
                .map((rowData, index) => (
                  <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={cellData}
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
        </ScrollView>
      </View>
    </View>
  );
};

export default ExamScheduleScreen;
