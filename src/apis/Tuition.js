import { API_URL } from '../common/constant';

const url = `${API_URL}`;

class TuitionAPIs {
  constructor() {}

  getSemesters = (token) => {
    return fetch(`${url}/report/w-locdshockyhocphisinhvien`, {
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
              name: 'hoc_ky',
              order_type: 1,
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  getTuitions = (token, semester) => {
    if (semester === 'all') {
      return fetch(`${url}/rms/w-locdstonghophocphisv`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .catch((err) => console.log(err));
    }

    return fetch(`${url}/rms/w-locdschitiethocphisvtheohocky`, {
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

const tuitionAPIs = new TuitionAPIs();
export default tuitionAPIs;
