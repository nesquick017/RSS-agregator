/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import i18next from 'i18next';
import rssWatched from './watchers/watcher.js';
import resources from './locales/index.js';
import setRssSchema from './rssValidation.js';

export default () => {
  const state = {};
  state.rssContent = {};
  state.modalWindow = { active: false };
  state.dictionary = {};
  state.dictionary.activeLanguage = 'ru';
  state.dictionary.i18nextInstance = null;

  state.rssForm = {};
  state.rssForm.feedsListLink = [];
  state.rssForm.input = { value: '', valid: true, error: '' };

  const createI18NextInstance = (activeLanguage) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init({ lng: activeLanguage, resources });
    return i18nextInstance;
  };

  const rssForm = document.querySelector('.rss-form, text-body');
  const stateWatched = rssWatched(state, rssForm);
  state.dictionary.i18nextInstance = createI18NextInstance(state.dictionary.activeLanguage);

  rssForm.addEventListener('submit', (e) => {
    const rssFormInput = rssForm.querySelector('#url-input');
    const rssSchema = setRssSchema(state.rssForm.feedsListLink, state.dictionary.i18nextInstance);
    e.preventDefault();
    rssSchema
      .validate({ link: rssFormInput.value.trim() })
      .then((validRssURL) => {
        stateWatched.rssForm.input.error = { type: null };
        state.rssForm.feedsListLink.push(validRssURL.link);
      })
      .catch((e) => {
        stateWatched.rssForm.input.error = e;
        console.log(e);
      });
  });
};
