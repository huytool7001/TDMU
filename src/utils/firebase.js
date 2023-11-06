import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '../common/constant';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  databaseURL: FIREBASE_DB_URL,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

class FireBase {
  constructor() {
    this.provider = null;
    this.auth = null;
    this.store = null;
  }

  load = () => {
    this.provider = new GoogleAuthProvider();
    const app = initializeApp(firebaseConfig);
    initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    this.auth = getAuth(app);
  };
}
const firebase = new FireBase();
export default firebase;
