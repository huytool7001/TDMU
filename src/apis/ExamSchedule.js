import { DKMH_API_URL, USER_ROLE } from '../common/constant';

const url = `${DKMH_API_URL}/`;

class ExamScheduleAPIs {
  constructor() {}

  getSemesters = (token) => {
    return fetch(`${url}/report/w-locdshockylichthisinhvien`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
              name: null,
              order_type: 1,
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  getSchedule = (token, semester, role = USER_ROLE.student) => {
    if (role === USER_ROLE.teacher) {
      return fetch(`${url}/epm/w-loclichthitonghoptheodoituong`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hoc_ky: semester,
          id_du_lieu: '',
          is_dk_coi_thi: false,
          loai_doi_tuong: 2,
          ngay_thi: '',
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
        .catch((err) => console.log(err));
    }

    return fetch(`${url}/epm/w-locdslichthisvtheohocky`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          hoc_ky: semester,
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
      .catch((err) => console.log(err));
  };
}

const examScheduleAPIs = new ExamScheduleAPIs();
export default examScheduleAPIs;
