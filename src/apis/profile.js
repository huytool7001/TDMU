import { API_URL, USER_ROLE } from '../common/constant';

const url = `${API_URL}`;

class ProfileAPIs {
  constructor() {}

  get = (token, role = USER_ROLE.student) => {
    if (role === USER_ROLE.teacher) {
      return fetch(`${url}/hrm/w-locgiangvieninfo`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .catch((err) => console.log(err));
    }

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
