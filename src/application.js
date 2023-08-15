/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import rssWatcher from './watchers/watcher.js';
import resources from './locales/index.js';
import rssParser from './rssParser.js';

export default () => {
  const initialState = {
    activeLanguage: 'ru',
    i18nInstance: null,
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
  const getAxiosResponse = (url) => {
    const allOrigins = 'https://allorigins.hexlet.app/get';
    const newUrl = new URL(allOrigins);
    newUrl.searchParams.set('url', url);
    newUrl.searchParams.set('disableCache', 'true');
    return axios.get(newUrl);
  };

  const addNewContent = (initialState, parsedData) => {
    const { rssContent } = initialState;
    const title = parsedData.querySelector('title');
    const description = parsedData.querySelector('description');
    const feedId = rssContent.feeds.length;
    const newFeed = { feedId, content: { title, description } };
    rssContent.feeds.push(newFeed);
    const newPosts = parsedData.querySelectorAll('item');
    newPosts.forEach((post) => {
      const postId = rssContent.posts.length;
      const title = post.querySelector('title');
      const description = post.querySelector('description');
      const link = post.querySelector('link').textContent;
      const newPost = { feedId, postId, content: { title, description, link } };
      rssContent.posts.push(newPost);
    });
  };

  const rssForm = document.querySelector('.rss-form, text-body');
  const rssFormInput = rssForm.querySelector('#url-input');
  const watchedState = rssWatcher(initialState);

  rssForm.addEventListener('submit', (e) => {
    initialState.i18nInstance = createI18NextInstance(initialState.activeLanguage, resources);
    const { visitedLinksIds } = initialState.uiState;
    e.preventDefault();
    const newUrl = rssFormInput.value;
    validate(newUrl, visitedLinksIds)
      .then((validUrl) => {
        initialState.uiState.visitedLinksIds.add(validUrl);
        getAxiosResponse(validUrl)
          .then((respond) => rssParser(respond))
          .then((parsedData) => {
            initialState.rssForm.process.processState = 'filling';
            initialState.rssForm.valid = true;
            initialState.rssForm.process.error = '';
            addNewContent(initialState, parsedData);
            watchedState.rssForm.process.processState = 'pending';
          });
      })
      .catch((e) => {
        initialState.rssForm.process.processState = 'filling';
        initialState.rssForm.valid = false;
        initialState.rssForm.process.error = e;
        watchedState.rssForm.process.processState = 'pending';
      });
  });
};
