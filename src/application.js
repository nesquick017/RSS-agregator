/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import rssWatcher from './watchers/watcher.js';

const getAxiosResponse = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get';
  const newUrl = new URL(allOrigins);
  newUrl.searchParams.set('url', url);
  newUrl.searchParams.set('disableCache', 'true');
  return axios.get(newUrl);
};
export { getAxiosResponse };

export default () => {
  const initialState = {
    activeLanguage: 'ru',
    rssForm: {
      valid: true,
      process: {
        processState: 'pending',
        error: null,
        value: '',
      },
    },
    rssContent: {
      posts: [],
      feeds: [],
    },
    uiState: {
      visitedLinksIds: new Set(),
      modalId: '',
    },
  };

  const validate = (url, urlList) => {
    const schema = yup.string().trim().required().url().notOneOf(urlList);
    return schema.validate(url);
  };

  const createI18NextInstance = (activeLanguage) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init({ lng: activeLanguage, resources });
    return i18nextInstance;
  };

  const rssForm = document.querySelector('.rss-form, text-body');

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const i18nextInstance = createI18NextInstance(initialState.activeLanguage);
    const watchedState = rssWatcher(initialState);
    const rssFormInput = rssForm.querySelector('#url-input');
    const newUrl = rssFormInput.value;
    const { visitedLinksIds } = initialState.uiState;
    validate(newUrl, visitedLinksIds)
      .then((validUrl) => {
        watchedState.rssForm.process.value = validUrl;
      })
      .catch((e) => {
        console.log(`${e}\n${e.type}`);
      });
  });
};
