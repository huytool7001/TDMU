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

const AnnouncementScreen = () => {
  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const { width } = useWindowDimensions();

  const [announcements, setAnnouncements] = React.useState([]);

  const [selected, setSelected] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

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
        onModalShow={() => announcementApis.reply(announcements[selected].id, { studentId: context.userId })}
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
              <ScrollView>
                <RenderHtml contentWidth={width} source={{ html: announcements[selected].noi_dung }} />
                {announcements[selected].files?.length ? (
                  <View style={{ borderTopWidth: 0.5, marginVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tệp đính kèm</Text>
                    {announcements[selected].files.map((file, index) => (
                      <View key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
