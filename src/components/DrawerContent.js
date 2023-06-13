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

const DrawerContent = (props) => {
  const [context, setContext] = React.useContext(Context);

  const [user, setUser] = React.useState({
    ten_day_du: '',
    email: '',
  });

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const result = await profileAPIs.get(context.token);

    if(result.code === 200){
      setUser(result.data);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();

      const result = await authAPIs.signOut(context.token);
      console.log(result)

      if (result.err) {
        Alert.alert('Oops!', result.err, [{ text: 'Ok' }]);
        return;
      }

      setContext({ ...context, token: null });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.paddingLeft20}>
            <View style={styles.headerSection}>
              <Avatar.Image
                source={{
                  uri: 'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
                }}
                size={50}
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
              icon={(color, size) => <Icon name="home-outline" size={size} color={color} />}
              onPress={() => props.navigation.navigate('Home')}
            />
            <DrawerItem
              label="Thời khóa biểu"
              icon={(color, size) => <Icon name="calendar" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('StudySchedule');
              }}
            />
            <DrawerItem
              label="Xem điểm"
              icon={(color, size) => <Icon name="table-search" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('Transcript');
              }}
            />
            <DrawerItem
              label="Xem lịch thi"
              icon={(color, size) => <Icon name="calendar-text" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('ExamSchedule');
              }}
            />
            <DrawerItem
              label="Hồ sơ"
              icon={(color, size) => <Icon name="cog-outline" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('Profile');
              }}
            />            
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section>
        <DrawerItem
          label="Đăng xuất"
          icon={(color, size) => <Icon name="exit-to-app" size={size} color={color} />}
          onPress={handleSignOut}
        />
      </Drawer.Section>
    </View>
  );
};

export { DrawerContent };
