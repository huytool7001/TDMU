import { DKMH_API_URL, SERVER_API_URL } from '../common/constant';
import messaging from '@react-native-firebase/messaging';

const dkmh_api_url = `${DKMH_API_URL}/auth`;
const server_api_url = `${SERVER_API_URL}`;

class AuthAPIs {
  constructor() {}

  signIn = async (token) => {
    return fetch(`${dkmh_api_url}/login`, {
      method: 'post',
      body: new URLSearchParams({ username: 'user@gw', password: token, grant_type: 'password' }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then(async (response) => {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();

        await fetch(`${server_api_url}/users`, {
          method: 'post',
          body: JSON.stringify({
            deviceToken: fcmToken,
            userId: response.userName,
            userToken: response.access_token,
            email: response.principal,
            name: response.name
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return response;
      })
      .catch((err) => console.log(err));
  };

  signOut = (token) => {
    return fetch(`${dkmh_api_url}/logout`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
}

const authAPIs = new AuthAPIs();
export default authAPIs;
