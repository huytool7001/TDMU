import { DKMH_API_URL } from '../common/constant';

const url = `${DKMH_API_URL}/web/w-locdsbaiviet`;

class ArticleAPIs {
  constructor() {}

  search = () => {
    return fetch(`${url}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          is_hien_thi: true,
          is_hinh_dai_dien: true,
          so_luong_hinh_dai_dien: 1,
        },
        additional: {
          paging: {
            limit: 100,
            page: 1,
          },
          ordering: [
            {
              name: 'do_uu_tien',
              order_type: 1,
            },
            {
              name: 'ngay_dang_tin',
              order_type: 1,
            },
          ],
        },
      }),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };

  get = (id) => {
    return fetch(`${url}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          id,
          is_hien_thi: true,
          is_hinh_dai_dien: false,
          is_noi_dung: true,
          is_quyen_xem: false,
          so_luong_hinh_dai_dien: 1,
        },
        additional: {
          paging: {
            limit: 1,
            page: 1,
            isLimit: false,
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

const articleAPIs = new ArticleAPIs();
export default articleAPIs;
