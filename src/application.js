/* eslint-disable newline-per-chained-call */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import * as yup from 'yup';
import i18next from 'i18next';
import rssWatched from './watchers/watcher.js';
import resources from './locales/index.js';

export default () => {
  const state = {};
  state.rssContent = { feeds: {}, empty: true };
  state.modalWindow = { active: false };
  state.dictionary = {};
  state.dictionary.activeLanguage = 'ru';
  state.dictionary.i18nextInstance = null;

  state.rssForm = {};
  state.rssForm.feedsListLink = [];
  state.rssForm.input = { value: '', valid: true, error: '' };

  const validate = (url, urlList) => {
    const schema = yup
      .string()
      .trim()
      .required()
      .url()
      .notOneOf(urlList)
      .test('rss', 'no rss content', (value) => /rss/i.test(value));
    return schema.validate(url);
  };

  const createI18NextInstance = (activeLanguage) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init({ lng: activeLanguage, resources });
    return i18nextInstance;
  };

  const rssForm = document.querySelector('.rss-form, text-body');
  const stateWatched = rssWatched(state, rssForm);
  state.dictionary.i18nextInstance = createI18NextInstance(state.dictionary.activeLanguage);

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rssFormInput = rssForm.querySelector('#url-input');
    const url = rssFormInput.value;
    validate(url, state.rssForm.feedsListLink)
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
