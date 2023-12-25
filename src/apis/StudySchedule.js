import { DKMH_API_URL, SERVER_API_URL } from '../common/constant';
import { TEST_SCHEDULE, TEST_USER_ID } from '../utils/mock';

const dkmh_api_url = `${DKMH_API_URL}/sch`;
const server_api_url = `${SERVER_API_URL}/`;

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

  getSchedule = async (token, semester, userId) => {
    let schedule = await fetch(`${dkmh_api_url}/w-locdstkbtuanusertheohocky`, {
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
    });

    schedule = await schedule.json();
    if (userId === TEST_USER_ID) {
      schedule.data?.ds_tuan_tkb[17].ds_thoi_khoa_bieu.push(TEST_SCHEDULE);
    }

    return schedule;
  };

  getStudents = (token, id) => {
    return fetch(`${dkmh_api_url}/w-locdssinhvientheotohoc`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          id_to_hoc: id,
          id_sinh_hoat: '0',
        },
        additional: {
          paging: {
            limit: 500,
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
      .catch((err) => console.log(err));
  };
}

const studyScheduleAPIs = new StudyScheduleAPIs();
export default studyScheduleAPIs;
