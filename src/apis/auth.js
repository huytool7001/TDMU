import { API_URL } from '../common/constant';

const url = `${API_URL}/auth`;

class AuthAPIs {
  constructor() {}

  signIn = (token) => {
    return fetch(`${url}/login`, {
      method: 'post',
      body: new URLSearchParams({ username: 'user@gw', password: token, grant_type: 'password' }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  signOut = (token) => {
    return fetch(`${url}/logout`, {
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
