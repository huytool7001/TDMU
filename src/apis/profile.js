import { API_URL } from '../common/constant';

const url = `${API_URL}`;

class ProfileAPIs {
  constructor() {}

  get = (token) => {
    return fetch(`${url}/dkmh/w-locsinhvieninfo`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
}

const profileAPIs = new ProfileAPIs();
export default profileAPIs;
