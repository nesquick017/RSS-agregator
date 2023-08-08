/* eslint-disable no-shadow */
import rssWatched from './watcher.js';
import { setState, setRssSchema } from './utils.js';

export default () => {
  const stateName = 'rssForm';

  const state = setState(stateName);
  state[stateName].feedsList = [];
  state[stateName].validation = { valid: null, status: 'created', value: '' };
  state[stateName].newLink = '';

  const rssForm = document.querySelector('form[name="Rss manager form"]');
  const rssFormInput = rssForm.querySelector('input[type="text"]');

  const rssWatcher = rssWatched(state, rssFormInput);
  console.log(rssWatcher);

  const rssSchema = setRssSchema(state[stateName].feedsList);

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    rssSchema
      .validate({ newLink: rssFormInput.value })
      .then(() => {
        rssWatcher[stateName].validation.valid = true;
        state[stateName].feedsList.push(rssFormInput.value);
        rssFormInput.value = '';
        rssFormInput.focus();
      })
      .catch((e) => {
        rssWatcher[stateName].validation.valid = false;
        console.log('Error, ', e);
      });
    console.log(state[stateName].feedsList);
  });
};
