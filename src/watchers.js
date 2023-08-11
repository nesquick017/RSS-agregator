/* eslint-disable no-unused-vars */
// view.js
import onChange from 'on-change';
import renderForm from './renderRssForm.js';

const rssWatched = (state, element) => {
  const watchedState = onChange(state, (path, value) => {
    renderForm(value, element, state.dictionary);
  });
  return watchedState;
};

export default rssWatched;
