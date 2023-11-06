/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notification from './src/utils/notification';
import { PermissionsAndroid } from 'react-native';
import firebase from './src/utils/firebase';
import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

if (!global.Buffer) {
  global.Buffer = require('buffer').Buffer;
}

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

notification.load();
firebase.load();

AppRegistry.registerComponent(appName, () => App);
