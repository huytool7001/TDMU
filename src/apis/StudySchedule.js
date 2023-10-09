import { DKMH_API_URL, SERVER_API_URL } from '../common/constant';

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
    let notes = await fetch(`${server_api_url}/schedule-notes?userId=${userId}`);
    notes = await notes.json();

    schedule.data?.ds_tuan_tkb?.forEach((tuan, i) => {
      tuan?.ds_thoi_khoa_bieu?.forEach((tkb, j) => {
        const existed = notes.find((item) => item.scheduleId === `${tkb.ngay_hoc}_${tkb.tiet_bat_dau}`);
        if (existed) {
          schedule.data.ds_tuan_tkb[i].ds_thoi_khoa_bieu[j].note = existed;
        }
      });
    });

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

  updateNote = (noteData) => {
    return fetch(`${server_api_url}/schedule-notes`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  deleteNote = (userId, scheduleId) => {
    return fetch(`${server_api_url}/schedule-notes/${userId}/${scheduleId}`, {
      method: 'delete',
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
}

const studyScheduleAPIs = new StudyScheduleAPIs();
export default studyScheduleAPIs;
