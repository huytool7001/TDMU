import { DKMH_API_URL, USER_ROLE } from '../common/constant';

const url = `${DKMH_API_URL}/`;

class TranscriptAPIs {
  constructor() {}

  getTranscripts = (token, semester = '', role = USER_ROLE.student) => {
    if (role === USER_ROLE.teacher) {
      return fetch(`${url}/sch/w-locdsmonhocgiangvientheohocky`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            hoc_ky: semester,
            is_tieng_anh: false,
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
    }

    return fetch(`${url}/srm/w-locdsdiemsinhvien`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  getSemesters = (token) => {
    return fetch(`${url}/sch/w-locdshockytkbuser`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          hoc_ky: '',
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
              order_type: null,
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  getStudents = (token, id) => {
    return fetch(`${url}/srm/w-locdssinhviennhapdiemnhomhoc`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          id,
          ds_ky_hieu: ['K1', 'T1'],
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

const transcriptAPIs = new TranscriptAPIs();
export default transcriptAPIs;
