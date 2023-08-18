import onChange from 'on-change';
import { getNewPosts } from '../application.js';

export default (state, callback) => {
  const watchedState = onChange(state, callback);
  getNewPosts(watchedState);
  return watchedState;
};
