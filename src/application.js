/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import i18next from 'i18next';
import rssWatched from './watchers.js';
import resources from './locales/index.js';
import setRssSchema from './rssValidation.js';

export default () => {
  const state = {};
  state.dictionary = {};
  state.dictionary.activeLanguage = 'ru';
  state.dictionary.i18nextInstance = null;

  state.rssForm = {};
  state.rssForm.feedsList = [];
  state.rssForm.input = { value: '', valid: true, error: '' };

  const createI18NextInstance = (activeLanguage) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init({ lng: activeLanguage, resources });
    return i18nextInstance;
  };

  const rssForm = document.querySelector('form[name="Rss manager form"]');
  const stateWatched = rssWatched(state, rssForm);
  state.dictionary.i18nextInstance = createI18NextInstance(state.dictionary.activeLanguage);

  rssForm.addEventListener('submit', (e) => {
    console.log('sumb');
    const rssFormInput = rssForm.querySelector('#url-input');
    const rssSchema = setRssSchema(state.rssForm.feedsList, state.dictionary.i18nextInstance);
    e.preventDefault();
    rssSchema
      .validate({ link: rssFormInput.value.trim() })
      .then((validRssURL) => {
        stateWatched.rssForm.input.error = { type: null };
        state.rssForm.feedsList.push(validRssURL.link);
      })
      .catch((e) => {
        stateWatched.rssForm.input.error = e;
        console.log(e);
      });
  });
};
