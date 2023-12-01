import { SERVER_API_URL } from '../common/constant';

const server_api_url = `${SERVER_API_URL}/schedule-notes`;

class ScheduleNoteApis {
  constructor() {}

  get = (id) => {
    return fetch(`${server_api_url}/${id}`)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  search = (query) => {
    return fetch(`${server_api_url}?${new URLSearchParams(query)}`)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  create = (noteData) => {
    return fetch(`${server_api_url}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  update = (id, noteData) => {
    return fetch(`${server_api_url}/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  delete = (id) => {
    return fetch(`${server_api_url}/${id}`, {
      method: 'delete',
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
}

const scheduleNoteApis = new ScheduleNoteApis();
export default scheduleNoteApis;
