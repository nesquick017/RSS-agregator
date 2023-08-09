/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import i18next from 'i18next';
import rssWatched from './watchers.js';
import resources from './locales/index.js';
import setRssSchema from './rssValidation.js';
import renderRssForm from './renderRssForm.js';

export default () => {
  const state = {};
  state.dictionary = {};
  state.dictionary.activeLanguage = 'ru';
  state.dictionary.i18nextInstance = null;

  state.rssForm = {};
  state.rssForm.feedsList = [];
  state.rssForm.input = { value: '', valid: null, error: '' };

  const createI18NextInstance = (state) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init({ lng: state.dictionary.activeLanguage, resources });
    return i18nextInstance;
  };

  const rssForm = document.querySelector('form[name="Rss manager form"]');
  const rssFormInput = rssForm.querySelector('input[type="text"]');
  const rssSchema = setRssSchema(state.rssForm.feedsList);
  const stateWatched = rssWatched(state, rssForm);

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
        state.rssForm.input.errors = e.message;
        stateWatched.rssForm.input.valid = false;
        console.log('Validation error, ', e);
      });
  });
  renderRssForm(state, rssForm);
  rssFormInput.focus();
};
