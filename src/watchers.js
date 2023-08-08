// view.js
import onChange from 'on-change';
import renderForm from './renderRssForm.js';

const rssWatched = (state, element) => {
  const watchedState = onChange(state, () => {
    renderForm(state, element);
  });
  return watchedState;
};

export default rssWatched;
