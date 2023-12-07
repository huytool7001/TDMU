import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Divider, List, Searchbar, Text } from 'react-native-paper';
import { toLowerCaseNonAccentVietnamese } from '../utils/functions';
import ReactNativeModal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherTransciptList = ({ data }) => {
  const [members, setMembers] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});

  useEffect(() => {
    searchMembers = async () => {
      const members = data.filter(
        (member) =>
          toLowerCaseNonAccentVietnamese(`${member.ho_lot_sv} ${member.ten_sv}`).includes(
            searchTerm.trim().toLowerCase(),
          ) || member.ma_sv.includes(searchTerm.trim().toLowerCase()),
      );
      setMembers(members);
    };

    searchMembers();
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <Searchbar
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        placeholder="Nhập tên hoặc MSSV ..."
        style={{ margin: 10 }}
      />
      <List.Item
        title={`Thành viên (${members.length})`}
        titleStyle={{ fontSize: 16, color: '#1d6191' }}
        right={({ color, style }) => (
          <View
            style={{
              ...style,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 110,
            }}
          >
            <Text style={{ fontSize: 16, color: '#1d6191', marginRight: '18%' }}>KTDK</Text>
            <Text style={{ fontSize: 16, color: '#1d6191', marginLeft: '18%' }}>KTHP</Text>
          </View>
        )}
      />
      <FlatList
        data={members}
        keyExtractor={(item) => item.ma_sv.toString()}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.ho_lot_sv} ${item.ten_sv}`}
            description={item.ma_sv}
            titleNumberOfLines={1}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={1}
            onPress={() => {
              setSelectedStudent(item);
              setOpenModal(true);
            }}
            right={({ color, style }) => (
              <View
                style={{
                  ...style,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: 100,
                }}
              >
                <Text>{item.ds_diem_tp[1].diem}</Text>
                <Text>{item.ds_diem_tp[2].diem}</Text>
              </View>
            )}
          />
        )}
      />
      <ReactNativeModal
        isVisible={openModal}
        onBackdropPress={() => setOpenModal(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        children={
          Object.keys(selectedStudent).length &&
          selectedStudent && (
            <View style={{ height: '50%', backgroundColor: '#fff' }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setOpenModal(false)}>
                  <MaterialCommunityIcons name="close" size={20} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000' }}>Sinh viên</Text>
                </View>
                <View style={{ marginRight: 10 }} />
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
                  editable={false}
                  value={`${selectedStudent.ho_lot_sv} ${selectedStudent.ten_sv}`}
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
                  editable={false}
                  value={selectedStudent.ma_sv}
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
                  editable={false}
                  value={selectedStudent.ma_lop}
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
                  editable={false}
                  value={`KTDK: ${selectedStudent.ds_diem_tp[1].diem}`}
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
                  editable={false}
                  value={`KTHP: ${selectedStudent.ds_diem_tp[2].diem}`}
                />
              </View>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
  },
  listDescription: {
    fontSize: 14,
  },
});

export default TeacherTransciptList;
