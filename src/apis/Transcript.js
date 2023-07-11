import { API_URL } from '../common/constant';

const url = `${API_URL}/srm`;

class TranscriptAPIs {
  constructor() {}

  getTranscripts = (token) => {
    return fetch(`${url}/w-locdsdiemsinhvien`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
}

const transcriptAPIs = new TranscriptAPIs();
export default transcriptAPIs;
