/* eslint-disable no-shadow */
import setRssSchema from './rssValidation.js';
import rssWatched from './watchers.js';

export default () => {
  const state = {};
  state.rssForm = {};
  state.rssForm.feedsList = [];
  state.rssForm.input = { value: '', valid: true, status: 'waiting' };

  const rssForm = document.querySelector('form[name="Rss manager form"]');
  const rssFormInput = rssForm.querySelector('input[type="text"]');
  rssFormInput.focus();
  const rssSchema = setRssSchema(state.rssForm.feedsList);
  const stateWatched = rssWatched(state, rssFormInput);

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    rssSchema
      .validate({ link: rssFormInput.value })
      .then((validRssURL) => {
        stateWatched.rssForm.input.valid = true;
        state.rssForm.feedsList.push(validRssURL.link);
        rssFormInput.value = '';
        rssFormInput.focus();
      })
      .catch((e) => {
        stateWatched.rssForm.input.valid = false;
        console.log('Validation error, ', e);
      });
  });
};
