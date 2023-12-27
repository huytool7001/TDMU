import React from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Alert,
  RefreshControl,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import RenderHtml from 'react-native-render-html';
import styles from '../themes/screens/HomeScreen';
import announcementApis from '../apis/Announcement';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/context';
import RNFetchBlob from 'rn-fetch-blob';
import { USER_ROLE } from '../common/constant';
import { Avatar } from 'react-native-paper';

const AnnouncementScreen = () => {
  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const { width } = useWindowDimensions();

  const [announcements, setAnnouncements] = React.useState([]);

  const [selected, setSelected] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [text, setText] = React.useState('');

  const getData = async () => {
    const data = await announcementApis.search({ showing: true, userId: context.userId });
    if (data?.announcements.length) {
      data.announcements.reverse();
      setAnnouncements(
        data.announcements.map((announcement) => ({
          id: announcement.id,
          tieu_de: announcement.title,
          ngay_hieu_chinh: announcement.at,
          noi_dung: announcement.body,
          files: announcement.files,
          replies: announcement.replies?.find((reply) => reply.userId === context.userId)?.data || [],
        })),
      );
    }
  };

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getData();
    setContext({ ...context, isLoading: false });
  }, [isFocus]);

  const handleOpeningFile = async (file) => {
    const rootDir = RNFetchBlob.fs.dirs.DownloadDir;
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        path: rootDir + '/' + file.name,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };

    await RNFetchBlob.config(options).fetch('GET', file.path);

    return Alert.alert('Downloading file...', '1 tệp đang được tải xuống', [], { cancelable: true });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        onModalHide={() => setSelected(null)}
        onModalShow={() => announcementApis.seen(announcements[selected].id, { userId: context.userId })}
        children={
          selected !== null ? (
            <Animatable.View style={styles.modalContainer} animation="slideInUp">
              <Text style={styles.modalHeader}>
                <AntDesign name="arrowleft" size={24} onPress={() => setModalVisible(false)} />{' '}
                {announcements[selected]?.tieu_de}
              </Text>
              <Text style={styles.modalSubtitle}>
                {new Date(announcements[selected]?.ngay_hieu_chinh).toLocaleString('en-GB')}
              </Text>
              <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <RenderHtml contentWidth={width} source={{ html: announcements[selected].noi_dung }} />
                {announcements[selected].files?.length ? (
                  <View style={{ borderTopWidth: 0.5, marginVertical: 20, paddingVertical: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tệp đính kèm</Text>
                    {announcements[selected].files.map((file, index) => (
                      <View
                        key={index}
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}
                      >
                        <AntDesign name="link" />
                        <Text
                          key={index}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                          style={{ marginLeft: 10, width: '90%' }}
                          onPress={() => handleOpeningFile(file)}
                        >
                          {file.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <></>
                )}
                <View style={{ borderTopWidth: 0.5, marginTop: 20, paddingVertical: 20, flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Phản hồi</Text>
                  <View style={{ flex: 1, marginBottom: 10 }}>
                    <TextInput
                      textAlign="left"
                      textAlignVertical="top"
                      style={{
                        marginVertical: 10,
                        height: 100,
                        borderRadius: 8,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 10,
                        color: '#000',
                      }}
                      value={text}
                      onChangeText={(text) => setText(text)}
                    />
                    <Button
                      title="Gửi"
                      color="#30cc00"
                      onPress={() => {
                        if (text) {
                          announcementApis.reply(announcements[selected].id, context.userId, context.role, text);
                          const prevState = announcements;
                          prevState[selected].replies = prevState[selected].replies || [];
                          prevState[selected].replies.push({ from: context.role, text, at: new Date().getTime() });
                          setAnnouncements(prevState);
                          setText('');
                        }
                      }}
                    />
                  </View>
                  {announcements[selected].replies.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginVertical: 10,
                        marginHorizontal: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                      }}
                    >
                      <Avatar.Image
                        source={
                          item.from === context.role
                            ? require('../assets/male_boy_person_people_avatar_icon_159358.png')
                            : require('../assets/9703596.png')
                        }
                        size={32}
                        style={{ backgroundColor: '#64b5f6' }}
                      />
                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <View
                          style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {item.from === context.role ? 'Bạn' : 'Admin'}
                          </Text>
                          <Text style={{ fontStyle: 'italic', fontSize: 12 }}>
                            {new Date(item.at).toLocaleString()}
                          </Text>
                        </View>
                        <Text>{item.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </Animatable.View>
          ) : (
            <></>
          )
        }
      />

      <FlatList
        data={announcements}
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.article}
            onPress={() => {
              setSelected(index);
              setModalVisible(true);
            }}
          >
            <Image
              source={require('../assets/bell.png')}
              style={{
                width: 50,
                height: 50,
                resizeMode: 'contain',
              }}
            />
            <View
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, marginLeft: 20 }}
            >
              <Text style={styles.text}>{item.tieu_de}</Text>
              <Text style={{ textAlign: 'right', fontStyle: 'italic', marginLeft: 4 }}>
                {new Date(item.ngay_hieu_chinh).toLocaleString('en-GB')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AnnouncementScreen;
