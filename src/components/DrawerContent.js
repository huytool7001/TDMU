import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import styles from '../themes/components/DrawerContent';
import authAPIs from '../apis/Auth';
import { Context } from '../utils/context';
import profileAPIs from '../apis/Profile';
import { USER_ROLE } from '../common/constant';

const DrawerContent = (props) => {
  const [context, setContext] = React.useContext(Context);

  const [user, setUser] = React.useState({
    ten_day_du: '',
    email: '',
    gioi_tinh: 'Nam',
  });

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const result = await profileAPIs.get(context.token, context.role);

    if (result.code === 200) {
      setUser({
        ten_day_du: result.data.ten_day_du || result.data.ten_giang_vien,
        email: result.data.email || result.data.email_1,
        gioi_tinh: result.data.gioi_tinh || '',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();

      const result = await authAPIs.signOut(context.token);

      if (result.err) {
        Alert.alert('Oops!', result.err, [{ text: 'Ok' }]);
        return;
      }

      clearTimeout(context.timer);

      setContext({ ...context, token: '', role: '', timer: null });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.paddingLeft}>
            <View style={styles.headerSection}>
              <Avatar.Image
                source={
                  context.role === USER_ROLE.teacher
                    ? require('../assets/3542609.png')
                    : user.gioi_tinh === 'Nữ'
                    ? require('../assets/avatar_female_woman_person_people_white_tone_icon_159360.png')
                    : require('../assets/male_boy_person_people_avatar_icon_159358.png')
                }
                size={50}
                style={{ backgroundColor: 'transparent' }}
              />
              <View style={styles.userInfoSection}>
                <Title style={styles.title}>{user.ten_day_du}</Title>
                <Caption style={styles.caption}>{user.email}</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="Trang chủ"
              icon={(color) => <Icon name="home" size={18} color={color} />}
              onPress={() => props.navigation.navigate('Home')}
            />
            <DrawerItem
              label="Thời khóa biểu"
              icon={(color) => <Icon name="calendar" size={18} color={color} />}
              onPress={() => {
                props.navigation.navigate('StudySchedule');
              }}
            />
            <DrawerItem
              label="Điểm"
              icon={(color) => <Icon name="numeric-9-plus-box-multiple" size={18} color={color} />}
              onPress={() => {
                props.navigation.navigate('Transcript');
              }}
            />
            <DrawerItem
              label="Lịch thi"
              icon={(color) => <Icon name="pencil-box-multiple" size={18} color={color} />}
              onPress={() => {
                props.navigation.navigate('ExamSchedule');
              }}
            />
            {context.role === USER_ROLE.student && (
              <DrawerItem
                label="Học phí"
                icon={(color) => <Icon name="account-cash" size={18} color={color} />}
                onPress={() => {
                  props.navigation.navigate('Tuition');
                }}
              />
            )}
            <DrawerItem
              label="Hồ sơ"
              icon={(color) => <Icon name="badge-account-horizontal" size={18} color={color} />}
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />
            <DrawerItem
              label="Cài đặt"
              icon={(color) => <Icon name="cog" size={18} color={color} />}
              onPress={() => {
                props.navigation.navigate('Setting');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section>
        <DrawerItem
          label="Đăng xuất"
          icon={(color) => (
            <Icon name="exit-to-app" size={18} color={color} style={{ transform: [{ rotateY: '180deg' }] }} />
          )}
          onPress={handleSignOut}
        />
      </Drawer.Section>
    </View>
  );
};

export { DrawerContent };
