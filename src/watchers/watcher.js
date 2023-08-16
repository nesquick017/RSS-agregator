/* eslint-disable no-unused-vars */
// view.js
import onChange from 'on-change';

export default (initialState, callback) => {
  const watchedData = onChange(initialState, (path, value) => {
    callback();
  });
  return watchedData;
};
