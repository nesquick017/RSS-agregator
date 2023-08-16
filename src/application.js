/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import rssWatcher from './watchers/watcher.js';
import resources from './locales/index.js';
import rssParser from './rssParser.js';
import render from './render.js';

export default () => {
  const initialState = {
    activeLanguage: 'ru',
    rssForm: {
      valid: true,
      process: {
        processState: 'pending',
        error: null,
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
  const getAxiosResponse = (url) => {
    const allOrigins = 'https://allorigins.hexlet.app/get';
    const newUrl = new URL(allOrigins);
    newUrl.searchParams.set('url', url);
    newUrl.searchParams.set('disableCache', 'true');
    return axios.get(newUrl);
  };

  const rssForm = document.querySelector('.rss-form, text-body');
  const rssFormInput = rssForm.querySelector('#url-input');

  rssForm.addEventListener('submit', (e) => {
    const feedsElement = document.querySelector('.feeds');
    const postsElement = document.querySelector('.posts');
    const elements = { feedsElement, postsElement };
    const i18nInstance = createI18NextInstance(initialState.activeLanguage, resources);
    const watchedState = rssWatcher(initialState, () =>
      render(elements, initialState, i18nInstance),
    );
    const { visitedLinksIds } = initialState.uiState;
    e.preventDefault();
    const newUrl = rssFormInput.value;
    validate(newUrl, visitedLinksIds)
      .then((validUrl) => {
        visitedLinksIds.add(validUrl);
        getAxiosResponse(validUrl)
          .then((responde) => rssParser(responde.data.contents))
          .then((data) => {
            const { feed, posts } = data;
            const { rssContent } = initialState;
            const dataId = visitedLinksIds.size;
            rssContent.feeds.push({ dataId, feed });
            rssContent.posts.push({ dataId, posts });
            watchedState.rssForm.process.error = '';
          });
      })
      .catch((e) => {
        watchedState.rssForm.process.error = e;
      });
  });
};
