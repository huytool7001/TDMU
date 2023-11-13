import { SERVER_API_URL } from '../common/constant';

const url = `${SERVER_API_URL}/notifications`;

class NotificationApis {
  constructor() {}

  create = async (channelId, text, userEmail, username) => {
    return fetch(`${url}/chat`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelId, text, userEmail, username }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };
}

const notificationApis = new NotificationApis();
export default notificationApis;
