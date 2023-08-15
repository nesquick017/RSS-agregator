/* eslint-disable no-unused-vars */
// view.js
import onChange from 'on-change';
import render from '../render.js';

export default (initialState) => {
  const watchedData = onChange(initialState, (path, value) => {
    render(initialState);
  });
  return watchedData;
};
