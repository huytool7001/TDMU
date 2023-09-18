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
}

const announcementApis = new AnnouncementApis();
export default announcementApis;
