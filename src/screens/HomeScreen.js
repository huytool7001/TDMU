import React from 'react';
import { View, Text, ScrollView, useWindowDimensions, Alert, RefreshControl } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import RenderHtml from 'react-native-render-html';
import styles from '../themes/screens/HomeScreen';
import articleAPIs from '../apis/Article';
import announcementApis from '../apis/Announcement';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/context';
import RNFetchBlob from 'rn-fetch-blob';

const HomeScreen = () => {
  const isFocus = useIsFocused();
  const { width } = useWindowDimensions();
  const [context, setContext] = React.useContext(Context);
  const [data, setData] = React.useState({
    tb: [],
    hd: [],
  });
  const [announcements, setAnnouncements] = React.useState([]);

  const [selected, setSelected] = React.useState({
    key: '',
    index: null,
    data: null,
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const getData = async () => {
    const result = await articleAPIs.search();
    if (result.code === 200) {
      setData({
        ...data,
        tb: result.data.ds_bai_viet.filter((bai_viet) => bai_viet.ky_hieu === 'tb'),
        hd: result.data.ds_bai_viet.filter((bai_viet) => bai_viet.ky_hieu === 'hd'),
      });
    }

    const announcements = await announcementApis.search({ showing: true, userId: context.userId });
    if (announcements.announcements.length) {
      setAnnouncements(
        announcements.announcements.map((announcement) => ({
          id: announcement.id,
          tieu_de: announcement.title,
          ngay_dang_tin: announcement.createdAt,
          noi_dung: announcement.body,
          files: announcement.files,
        })),
      );
    }
  };

  const getSelected = async (key, index) => {
    if (key === 'announcement') {
      setSelected({ ...selected, key, index, data: announcements[index] });
    } else {
      const result = await articleAPIs.get(data[`${key}`][index].id);
      if (result.code === 200) {
        setSelected({
          ...selected,
          key,
          index,
          data: result.data.ds_bai_viet[0],
        });
      }
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
    <ScrollView
      style={{
        flex: 1,
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Modal
        children={
          <View>
            <Text></Text>
          </View>
        }
      />
      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        onModalHide={() => {
          if (selected.key === 'announcement') {
            announcementApis.reply(selected.data.id, { studentId: context.userId });
          }
          setSelected({ ...selected, key: '', index: null, data: null });
        }}
        children={
          selected.data ? (
            <Animatable.View style={styles.modalContainer} animation="slideInUp">
              <Text style={styles.modalHeader}>
                <AntDesign name="arrowleft" size={24} onPress={() => setModalVisible(false)} /> {selected.data?.tieu_de}
              </Text>
              <Text style={styles.modalSubtitle}>{new Date(selected.data?.ngay_dang_tin).toLocaleString('en-GB')}</Text>
              <ScrollView>
                <RenderHtml contentWidth={width} source={{ html: selected.data.tom_tat || selected.data.noi_dung }} />
                {selected.data.files?.length ? (
                  <View style={{ borderTopWidth: 0.5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tệp đính kèm</Text>
                    {selected.data.files.map((file, index) => (
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
      ></Modal>
      <View style={{ marginTop: 8 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Thông báo</Text>
        </View>
        <View style={styles.container}>
          {data.tb.map((bai_viet, index) => (
            <View key={bai_viet.id} style={styles.article}>
              <Text
                style={styles.text}
                onPress={() => {
                  getSelected('tb', index);
                  setModalVisible(true);
                }}
              >
                <AntDesign name="play" color="#000" /> {bai_viet.tieu_de}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Hướng dẫn</Text>
        </View>
        <View style={styles.container}>
          {data.hd.map((bai_viet, index) => (
            <View key={bai_viet.id} style={styles.article}>
              <Text
                style={styles.text}
                onPress={() => {
                  getSelected('hd', index);
                  setModalVisible(true);
                }}
              >
                <AntDesign name="play" color="#000" /> {bai_viet.tieu_de}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginTop: 8 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Khác</Text>
        </View>
        <View style={styles.container}>
          {announcements.map((bai_viet, index) => (
            <View key={bai_viet.id} style={styles.article}>
              <Text
                style={styles.text}
                onPress={() => {
                  getSelected('announcement', index);
                  setModalVisible(true);
                }}
              >
                <AntDesign name="play" color="#000" /> {bai_viet.tieu_de}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
