import { DKMH_API_URL, SERVER_API_URL } from '../common/constant';

const dkmh_api_url = `${DKMH_API_URL}/sch`;
const server_api_url = `${SERVER_API_URL}`;

class StudyScheduleAPIs {
  constructor() {}

  getSemesters = (token) => {
    return fetch(`${dkmh_api_url}/w-locdshockytkbuser`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        filter: {
          is_tieng_anh: null,
        },
        additional: {
          paging: {
            limit: 100,
            page: 1,
          },
          ordering: [
            {
              name: 'hoc_ky',
              order_type: 1,
            },
          ],
        },
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  getSchedule = (token, semester, userId) => {
    return fetch(`${dkmh_api_url}/w-locdstkbtuanusertheohocky`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          hoc_ky: semester,
          ten_hoc_ky: '',
        },
        additional: {
          paging: {
            limit: 100,
            page: 1,
          },
          ordering: [
            {
              name: null,
              order_type: null,
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        await fetch(`${server_api_url}/notifications/schedule`, {
          method: 'post',
          body: JSON.stringify({
            schedule: response.data,
            userId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return response;
      })
      .catch((err) => console.log(err));
  };
}

const studyScheduleAPIs = new StudyScheduleAPIs();
export default studyScheduleAPIs;
