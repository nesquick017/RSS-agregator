/* eslint-disable no-unused-vars */
import axios from 'axios';
import onChange from 'on-change';

export default (initialState, callback) => {
  const { getAxiosResponse } = initialState;
  const watchedData = onChange(initialState, (path, value) => {
    const { rssForm } = initialState;
    if (rssForm.valid) {
      setInterval(() => {
        getAxiosResponse(rssForm.value).then((responde) => console.log(responde.data));
      }, 5000);
    }
    callback();
  });
  return watchedData;
};
