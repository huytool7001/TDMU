import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Context } from '../utils/context';
import profileAPIs from '../apis/Profile';
import styles from '../themes/screens/ProfileScreen';
import { Avatar } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ScrollView } from 'react-native-gesture-handler';

const ProfileScreen = () => {
  const [context, setContext] = React.useContext(Context);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const result = await profileAPIs.get(context.token);
    if (result.code === 200) {
      setUser(result.data);
    }
  };

  const ProfileTab = () => (
    <ScrollView style={styles.profileContainer}>
      <View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Mã SV</Text>
          <Text>{user?.ma_sv}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Họ tên</Text>
          <Text>{user?.ten_day_du}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Giới tính</Text>
          <Text>{user?.gioi_tinh}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Ngày sinh</Text>
          <Text>{user?.ngay_sinh}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Nơi sinh</Text>
          <Text>{user?.noi_sinh}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Dân tộc</Text>
          <Text>{user?.dan_toc}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Tôn giáo</Text>
          <Text>{user?.ton_giao}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Điện thoại</Text>
          <Text>{user?.dien_thoai}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Email</Text>
          <Text>{user?.email}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Email 2</Text>
          <Text>{user?.email2}</Text>
        </View>
      </View>
    </ScrollView>
  );
  
  const ClassTab = () => (
    <View style={styles.profileContainer}>
      <View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Lớp</Text>
          <Text>{user?.lop}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Ngành</Text>
          <Text>{user?.nganh}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Khoa</Text>
          <Text>{user?.khoa}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Bậc hệ đào tạo</Text>
          <Text>{user?.bac_he_dao_tao}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Niên khóa</Text>
          <Text>{user?.nien_khoa}</Text>
        </View>
      </View>
    </View>
  );

  const TeacherTab = () => (
    <View style={styles.profileContainer}>
      <View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Họ tên</Text>
          <Text>{user?.ho_ten_cvht}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Email</Text>
          <Text>{user?.email_cvht}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Điện thoại</Text>
          <Text>{user?.dien_thoai_cvht}</Text>
        </View>
      </View>
    </View>
  );

  // tab
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'profile', title: 'Thông tin' },
    { key: 'class', title: 'Khóa học' },
    { key: 'teacher', title: 'CVHT' },
  ]);
  const renderScene = SceneMap({
    profile: ProfileTab,
    class: ClassTab,
    teacher: TeacherTab
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          source={
            user?.gioi_tinh === 'Nữ'
              ? require('../assets/avatar_female_woman_person_people_white_tone_icon_159360.png')
              : require('../assets/male_boy_person_people_avatar_icon_159358.png')
          }
          size={100}
        />
      </View>
      <TabView
        renderTabBar={props => <TabBar {...props} style={{ backgroundColor: '#2596be' }}/>}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default ProfileScreen;
