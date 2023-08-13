import axios from 'axios';

export default (url) =>
  axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.status === 200) {
        return response;
      }
      throw new Error('Network issue');
    })
    .catch((e) => console.log(e));
