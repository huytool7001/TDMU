import { SERVER_API_URL } from '../common/constant';

const url = `${SERVER_API_URL}/announcements`;

class AnnouncementApis {
  constructor() {}

  get = async (id) => {
    return fetch(`${url}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  search = async (query) => {
    return fetch(`${url}?` + new URLSearchParams(query), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  seen = async (id, data) => {
    return fetch(`${url}/${id}/replies`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  reply = async (id, studentId, role, text) => {
    return fetch(`${url}/${id}/replies/${studentId}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: role, text, at: new Date().getTime() }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };
}

const announcementApis = new AnnouncementApis();
export default announcementApis;
