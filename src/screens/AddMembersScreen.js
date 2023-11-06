import React, { useState } from 'react';
import { FlatList, StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { Divider, List, Searchbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import userApis from '../apis/User';

export default function AddMembersScreen({ route, navigation }) {
  const { channel } = route.params;
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState('');

  getMembers = async () => {
    const emails = (await firestore().collection('GROUPS').doc(channel.id).get()).data().members;
    const res = await userApis.searchByEmails(`${userId}@student.tdmu.edu.vn`);
    setMembers(res.users.filter(user => !emails.includes(user.email)));
  };

  return (
    <View style={styles.container}>
      <Searchbar
        value={userId}
        onChangeText={(text) => setUserId(text)}
        placeholder="Nhập MSSV ..."
        autoFocus
        onSubmitEditing={() => {
          getMembers();
        }}
        onIconPress={() => {
          getMembers();
        }}
      />
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
                />
              </View>
            )}
            onPress={async () => {
              await firestore()
                .collection('GROUPS')
                .doc(channel.id)
                .update({ members: firestore.FieldValue.arrayUnion(item.email) })
                .then(() => {
                  Alert.alert('Thông báo', `Thành viên ${item.displayName} đã được thêm vào nhóm`, [
                    { style: 'default', onPress: () => navigation.goBack() },
                  ]);
                })
                .catch((e) => Alert.alert('Sorry', e.message));
            }}
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
