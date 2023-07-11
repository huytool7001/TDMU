/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notification from './src/utils/notification';
import { PermissionsAndroid } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

notification.load();

AppRegistry.registerComponent(appName, () => App);
