import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { Avatar, Divider, List, Searchbar, Text } from 'react-native-paper';
import { Context } from '../utils/context';
import firestore from '@react-native-firebase/firestore';
import userApis from '../apis/User';
import { USER_ROLE } from '../common/constant';
import { toLowerCaseNonAccentVietnamese } from '../utils/functions';

export default function GroupMembersScreen({ route }) {
  const { channel } = route.params;
  const [context, setContext] = useContext(Context);
  const [data, setData] = useState([]);
  const [members, setMembers] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getMembers = async () => {
      const userIds = await firestore().collection('GROUPS').doc(channel.id).get();
      const res = await userApis.searchByEmails(userIds.data().members);
      setData(res.users);
      setMembers(res.users);
    };

    if (refresh) {
      getMembers();
    }
  }, [refresh]);

  useEffect(() => {
    searchMembers = async () => {
      const members = data.filter(
        (member) =>
          toLowerCaseNonAccentVietnamese(member.displayName).includes(searchTerm.trim().toLowerCase()) ||
          member.email.includes(searchTerm.trim().toLowerCase()),
      );
      setMembers(members);
    };

    searchMembers();
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <Searchbar value={searchTerm} onChangeText={(text) => setSearchTerm(text)} placeholder="Nhập tên hoặc MSSV ..." />
      <Text style={{ marginHorizontal: 10, marginVertical: 16, fontSize: 16, color: '#1d6191' }}>
        Thành viên ({members.length})
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.uid.toString()}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <List.Item
            title={item.displayName}
            description={item.email}
            titleNumberOfLines={1}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={1}
            left={(props) => (
              <View>
                <ImageBackground
                  {...props}
                  source={{ uri: item.photoURL }}
                  style={{ marginLeft: 20, width: 50, height: 50, alignItems: 'flex-end', justifyContent: 'flex-end' }}
                  imageStyle={{ borderRadius: 25 }}
                  size={50}
                  resizeMode="contain"
                >
                  {/* <View
                    style={{
                      borderWidth: 4,
                      borderColor: '#fff',
                      borderRadius: 50,
                      width: 20,
                      height: 20,
                      backgroundColor: item.presence.online ? 'green' : 'red',
                    }}
                  ></View> */}
                </ImageBackground>
              </View>
            )}
            right={(props) =>
              context.role === USER_ROLE.teacher &&
              item.email !== context.email && (
                <TouchableOpacity
                  style={{ justifyContent: 'center' }}
                  onPress={() =>
                    Alert.alert('Lưu ý', 'Bạn có muốn xóa người này khỏi nhóm', [
                      { text: 'Hủy', style: 'cancel' },
                      {
                        text: 'Xóa',
                        onPress: async () => {
                          setRefresh(false);
                          await firestore()
                            .collection('GROUPS')
                            .doc(channel.id)
                            .update({ members: firestore.FieldValue.arrayRemove(item.email) });
                          setRefresh(true);
                        },
                      },
                    ])
                  }
                >
                  <List.Icon {...props} icon="delete" />
                </TouchableOpacity>
              )
            }
          />
        )}
      />
    </View>
  );
}

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
