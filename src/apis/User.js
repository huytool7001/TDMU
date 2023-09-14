import { SERVER_API_URL } from '../common/constant';
import messaging from '@react-native-firebase/messaging';

const url = `${SERVER_API_URL}/users`;

class UserApis {
  constructor() {}

  get = async () => {
    const fcmToken = await messaging().getToken();
    return fetch(`${url}/${fcmToken}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  update = async (data) => {
    const fcmToken = await messaging().getToken();
    return fetch(`${url}/${fcmToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };
}

const userApis = new UserApis();
export default userApis;
