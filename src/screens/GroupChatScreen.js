import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Text, Button } from 'react-native';
import { Divider, List } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Context } from '../utils/context';
import DropDownPicker from 'react-native-dropdown-picker';
import ReactNativeModal from 'react-native-modal';
import transcriptAPIs from '../apis/Transcript';
import dropdownStyles from '../themes/components/DropDown';
import firestore from '@react-native-firebase/firestore';
import { USER_ROLE } from '../common/constant';

export default function GroupChatScreen({ navigation }) {
  const [context, setContext] = useContext(Context);
  const [channels, setChannels] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // modal creating channel
  const [modalVisible, setModalVisible] = useState(false);
  const [nonGroupedSubjects, setNonGroupedSubjects] = useState([]);

  // subject dropdown
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    getTeachingSubjects();
  }, [channels]);

  const getTeachingSubjects = async () => {
    const result = await transcriptAPIs.getTeachingSubjects(context.token);
    if (result.code === 200) {
      setNonGroupedSubjects(
        result.data.ds_nhom_hoc
          .filter(
            (subject) => !channels.find((channel) => channel.name === `${subject.nhom_hoc} - ${subject.ten_mon_hoc}`),
          )
          ?.sort((a, b) => `${a.nhom_hoc} - ${a.ten_mon_hoc}`.localeCompare(`${b.nhom_hoc} - ${b.ten_mon_hoc}`)),
      );
    }
  };

  const getGroups = () => {
    firestore()
      .collection('GROUPS')
      .where('members', 'array-contains', context.email)
      .orderBy('latestMessage.createdAt', 'desc')
      .get()
      .then((querySnapshot) => {
        const threads =
          querySnapshot?.docs.map((documentSnapshot) => {
            return {
              id: documentSnapshot.id,
              // give defaults
              name: '',

              latestMessage: {
                text: '',
              },
              ...documentSnapshot.data(),
            };
          }) || [];

        setChannels(threads);
      });
  };

  useEffect(() => {
    if (isFocused || refresh) {
      getGroups();
    }
  }, [isFocused, refresh]);

  const createGroupChat = async () => {
    if (selectedSubject !== null) {
      setRefresh(false);
      setContext({ ...context, isLoading: true });
      await firestore()
        .collection('GROUPS')
        .add({
          name: `${selectedSubject.nhom_hoc} - ${selectedSubject.ten_mon_hoc}`,
          members: [context.email],
          latestMessage: {
            text: `Chào mừng bạn đến với ${selectedSubject.nhom_hoc} - ${selectedSubject.ten_mon_hoc}.`,
            createdAt: new Date().getTime(),
            system: true,
          },
        })
        .then(async (docRef) => {
          docRef.collection('MESSAGES').add({
            text: `Chào mừng bạn đến với ${selectedSubject.nhom_hoc} - ${selectedSubject.ten_mon_hoc}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
          await getTeachingSubjects();
          setModalVisible(false);
          setSelectedSubject(null);
        })
        .catch((e) => console.log(e));
      setContext({ ...context, isLoading: false });
      setRefresh(true);
    }
  };

  return (
    <View style={styles.container}>
      <ReactNativeModal
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={modalVisible}
        children={
          <>
            <View
              style={{
                backgroundColor: '#fff',
                height: 120,
                borderRadius: 4,
                padding: 10,
                marginBottom: 10,
                zIndex: 3,
              }}
            >
              <View
                style={{
                  ...dropdownStyles.container,
                  maxWidth: '100%',
                  paddingHorizontal: 0,
                  alignSelf: 'center',
                  marginTop: 10,
                }}
              >
                <DropDownPicker
                  placeholder="Chọn một lớp học"
                  dropDownDirection="BOTTOM"
                  open={open}
                  value={selectedSubject}
                  itemKey="label"
                  items={nonGroupedSubjects.map((subject) => {
                    return {
                      label: `${subject.nhom_hoc} - ${subject.ten_mon_hoc}`,
                      value: subject,
                    };
                  })}
                  setOpen={setOpen}
                  setValue={setSelectedSubject}
                  containerStyle={{}}
                  dropDownContainerStyle={{ ...dropdownStyles.dropDownContainer }}
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: '#8d8d8d',
                  bottom: 0,
                  position: 'absolute',
                  margin: 10,
                  textAlign: 'justify',
                  width: '100%',
                }}
              >
                Hệ thống sẽ tự động thêm danh sách sinh viên vào nhóm. (Bạn cũng có thể tự thêm vào sau đó)
              </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#30cc00',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  marginRight: 2,
                }}
                onPress={createGroupChat}
              >
                <Text style={{ color: '#fff' }}>Tạo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#cc0000',
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  marginLeft: 2,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff' }}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
      <FlatList
        data={channels}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${
              item.latestMessage.system
                ? ''
                : item.latestMessage.userId === context.email
                ? 'Bạn: '
                : `${item.latestMessage.username}: `
            }${item.latestMessage.text}`}
            titleNumberOfLines={1}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={1}
            onPress={() => navigation.navigate('Chat', { channel: item })}
          />
        )}
      />
      {context.role === USER_ROLE.teacher && (
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 20,
            right: 20,
            height: 70,
            backgroundColor: '#2596be',
            borderRadius: 100,
          }}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
