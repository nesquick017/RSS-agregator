// view.js
import onChange from 'on-change';
import { renderForm } from './utils.js';

const rssWatched = (state, element) => {
  const watchedState = onChange(state, (path, value) => {
    if (value === true || value === false) {
      renderForm(state, element);
    }
  });
  return watchedState;
};

export default rssWatched;
