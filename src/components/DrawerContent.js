import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../themes/DrawerContent';
import authAPIs from '../apis/auth';
import { Context } from '../utils/context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const DrawerContent = (props) => {
  const [context, setContext] = React.useContext(Context);

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
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: '5%' }}>
              <Avatar.Image
                source={{
                  uri: 'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
                }}
                size={50}
              />
              <View style={{ marginLeft: '5%', flexDirection: 'column' }}>
                <Title style={styles.title}>Administrator</Title>
                <Caption style={styles.caption}>admin@gmail.com</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              label="Home"
              icon={(color, size) => <Icon name="home-outline" size={size} color={color} />}
              onPress={() => props.navigation.navigate('Home')}
            />
            <DrawerItem
              label="Schedule"
              icon={(color, size) => <Icon name="calendar" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('Schedule');
              }}
            />
            <DrawerItem
              label="Transcript"
              icon={(color, size) => <Icon name="table-search" size={size} color={color} />}
              onPress={() => {
                props.navigation.navigate('Transcript');
              }}
            />
            <DrawerItem
              label="Profile"
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
          label="Sign out"
          icon={(color, size) => <Icon name="exit-to-app" size={size} color={color} />}
          onPress={handleSignOut}
        />
      </Drawer.Section>
    </View>
  );
};

export { DrawerContent };
