import { API_URL } from "../common/constant";

const url = `${API_URL}/users`;

class UserAPIs {
  constructor() {}

  signIn = data => {
    return fetch(`${url}/login`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .catch(err => console.log(err));
  };

  signOut = () => {
    return fetch(`${url}/logout`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .catch(err => console.log(err));
  };
}

const userAPIs = new UserAPIs();
export default userAPIs;
