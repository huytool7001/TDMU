import Config from 'react-native-config';

export const DKMH_API_URL = Config.DKMH_API_URL;
export const SERVER_API_URL = Config.SERVER_API_URL;

export const USER_ROLE = {
  student: 'SINHVIEN',
  teacher: 'GIANGVIEN',
};

export const NOTIFICATION_TIMER = {
  SCHEDULE: 15 * 60000, // 15 minutes
  EXAM: 60 * 60000, // 50 minutes
};
