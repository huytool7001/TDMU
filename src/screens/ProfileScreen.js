import React from 'react';
import { View, Text, useWindowDimensions, Image } from 'react-native';
import { Context } from '../utils/context';
import profileAPIs from '../apis/Profile';
import styles from '../themes/screens/ProfileScreen';
import { Avatar } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { USER_ROLE } from '../common/constant';

const ProfileScreen = () => {
  const isFocus = useIsFocused();
  const [context, setContext] = React.useContext(Context);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getProfile();
  }, [isFocus]);

  const getProfile = async () => {
    const result = await profileAPIs.get(context.token, context.role);
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

  const TeacherProfileTab = () => (
    <ScrollView style={styles.profileContainer}>
      <View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Mã GV</Text>
          <Text>{user?.ma_giang_vien}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Họ tên</Text>
          <Text>{user?.ten_giang_vien}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Học vị</Text>
          <Text>{user?.hoc_vi}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Điện thoại</Text>
          <Text>{user?.dien_thoai_1}</Text>
        </View>
        <View style={styles.formGroupContainer}>
          <Text style={styles.title}>Email</Text>
          <Text>{user?.email_1}</Text>
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
  const [routes] = React.useState(
    context.role === USER_ROLE.student
      ? [
          { key: 'profile', title: 'Thông tin' },
          { key: 'class', title: 'Khóa học' },
          { key: 'teacher', title: 'CVHT' },
        ]
      : [{ key: 'profile', title: 'Thông tin' }],
  );
  const renderScene = SceneMap(
    context.role === USER_ROLE.student
      ? {
          profile: ProfileTab,
          class: ClassTab,
          teacher: TeacherTab,
        }
      : { profile: TeacherProfileTab },
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/tn2-8506.jpg')}
          resizeMode="cover"
          resizeMethod="auto"
          style={styles.avatarBackground}
        />
        <Avatar.Image
          source={
            context.role === USER_ROLE.student
              ? user?.gioi_tinh === 'Nữ'
                ? require('../assets/avatar_female_woman_person_people_white_tone_icon_159360.png')
                : require('../assets/male_boy_person_people_avatar_icon_159358.png')
              : require('../assets/3542609.png')
          }
          size={120}
          style={{ marginTop: '-15%', backgroundColor: 'transparent' }}
        />
      </View>
      <TabView
        renderTabBar={(props) => (
          <TabBar {...props} style={{ backgroundColor: '#2596be' }} labelStyle={{ fontWeight: 'bold' }} />
        )}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
};

export default ProfileScreen;
