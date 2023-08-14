/* eslint-disable no-unused-vars */
// view.js
import onChange from 'on-change';
import render from '../render.js';

const rssWatched = (state, element) => {
  const watchedState = onChange(state, (path, value) => {
    render(value, element, state);
  });
  return watchedState;
};

export default rssWatched;
