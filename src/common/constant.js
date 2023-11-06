import Config from 'react-native-config';

export const DKMH_API_URL = Config.DKMH_API_URL;
export const SERVER_API_URL = Config.SERVER_API_URL;
export const FIREBASE_API_KEY = Config.FIREBASE_API_KEY;
export const FIREBASE_AUTH_DOMAIN = Config.FIREBASE_AUTH_DOMAIN;
export const FIREBASE_DB_URL = Config.FIREBASE_DB_URL;
export const FIREBASE_PROJECT_ID = Config.FIREBASE_PROJECT_ID;
export const FIREBASE_STORAGE_BUCKET = Config.FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_SENDER_ID = Config.FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = Config.FIREBASE_APP_ID;
export const FIREBASE_MEASUREMENT_ID = Config.FIREBASE_MEASUREMENT_ID;

export const USER_ROLE = {
  student: 'SINHVIEN',
  teacher: 'GIANGVIEN',
};

export const NOTIFICATION_TIMER = {
  SCHEDULE: 15 * 60000, // 15 minutes
  EXAM: 60 * 60000, // 50 minutes
};
