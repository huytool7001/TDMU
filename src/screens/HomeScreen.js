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
import articleAPIs from '../apis/Article';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/context';

const HomeScreen = () => {
  const isFocus = useIsFocused();
  const { width } = useWindowDimensions();
  const [context, setContext] = React.useContext(Context);
  const [data, setData] = React.useState([]);

  const [selected, setSelected] = React.useState({
    key: '',
    data: null,
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const getData = async () => {
    const result = await articleAPIs.search();
    if (result.code === 200) {
      result.data.ds_bai_viet.reverse();
      setData(result.data.ds_bai_viet);
    }
  };

  const getSelected = async (key, id) => {
    const result = await articleAPIs.get(id);
    if (result.code === 200) {
      setSelected({
        ...selected,
        key,
        data: result.data.ds_bai_viet[0],
      });
    }
  };

  React.useEffect(() => {
    setContext({ ...context, isLoading: true });
    getData();
    setContext({ ...context, isLoading: false });
  }, [isFocus]);

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
      <FlatList
        data={data.slice(1)}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() =>
          data.length ? (
            <TouchableOpacity
              style={{
                borderColor: '#dcdcdc',
                borderWidth: 2,
                borderRadius: 4,
              }}
              onPress={() => {
                getSelected(data[0].ky_hieu, data[0].id);
                setModalVisible(true);
              }}
            >
              <Image
                source={data[0].hinh_dai_dien ? { uri: data[0].hinh_dai_dien } : require('../assets/tn2-8506.jpg')}
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'cover',
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginHorizontal: 8,
                  textAlign: 'justify',
                }}
              >
                {data[0].tieu_de}
              </Text>
              <Text
                style={{
                  marginHorizontal: 8,
                  fontSize: 18,
                  marginBottom: 5,
                  textAlign: 'right',
                  fontStyle: 'italic',
                }}
              >
                {new Date(data[0].ngay_hieu_chinh).toLocaleString('en-GB')}
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: '#dcdcdc',
              borderWidth: 2,
              borderRadius: 4,
              marginTop: 10,
              padding: 10,
            }}
            onPress={() => {
              getSelected(item.ky_hieu, item.id);
              setModalVisible(true);
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'contain',
                borderRadius: 4,
              }}
              source={item.hinh_dai_dien ? { uri: item.hinh_dai_dien } : require('../assets/Icon.png')}
            />
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  marginLeft: 5,
                }}
              >
                {item.tieu_de}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'right',
                  fontStyle: 'italic',
                }}
              >
                {new Date(item.ngay_hieu_chinh).toLocaleString('en-GB')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          margin: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
        numColumns={1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Modal
        onBackButtonPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
        isVisible={modalVisible}
        onModalHide={() => {
          setSelected({ ...selected, key: '', index: null, data: null });
        }}
        children={
          selected.data ? (
            <Animatable.View style={styles.modalContainer} animation="slideInUp">
              <Text style={styles.modalHeader}>
                <AntDesign name="arrowleft" size={24} onPress={() => setModalVisible(false)} /> {selected.data?.tieu_de}
              </Text>
              <Text style={styles.modalSubtitle}>
                {new Date(selected.data?.ngay_hieu_chinh).toLocaleString('en-GB')}
              </Text>
              <ScrollView>
                <RenderHtml contentWidth={width} source={{ html: selected.data.tom_tat || selected.data.noi_dung }} />
              </ScrollView>
            </Animatable.View>
          ) : (
            <></>
          )
        }
      />
    </View>
  );
};

export default HomeScreen;
