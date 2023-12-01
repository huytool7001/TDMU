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
import { LogBox } from 'react-native';

// Ignore log notification by message:
LogBox.ignoreLogs([
  `ReactImageView: Image source "null" doesn't exist`,
  'Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.',
]);

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
