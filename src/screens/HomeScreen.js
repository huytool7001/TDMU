import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import RenderHtml from 'react-native-render-html';
import styles from '../themes/screens/HomeScreen';
import articleAPIs from '../apis/Article';
import announcementApis from '../apis/Announcement';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/context';

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
    getData();
  }, [isFocus]);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        onModalHide={() => setData({ ...data, key: '', index: null, data: null })}
        children={
          selected.data ? (
            <Animatable.View style={styles.modalContainer} animation="slideInUp">
              <Text style={styles.modalHeader}>
                <AntDesign name="arrowleft" size={24} onPress={() => setModalVisible(false)} /> {selected.data?.tieu_de}
              </Text>
              <Text style={styles.modalSubtitle}>{new Date(selected.data?.ngay_dang_tin).toLocaleString('en-GB')}</Text>
              <ScrollView>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: selected.key === 'tb' ? selected.data.tom_tat : selected.data.noi_dung }}
                />
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
