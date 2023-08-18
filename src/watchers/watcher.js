import onChange from 'on-change';

export default (state, callback, elements, initialState, i18nextInstance) => {
  const watchedState = onChange(state, () => {
    callback(elements, initialState, i18nextInstance);
  });
  return watchedState;
};
