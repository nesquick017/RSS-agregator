/* eslint-disable function-paren-newline */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import rssWatcher from './watchers/watcher.js';
import render from './render.js';

const getAxiosResponse = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get';
  const newUrl = new URL(allOrigins);
  newUrl.searchParams.set('url', url);
  newUrl.searchParams.set('disableCache', 'true');
  return axios.get(newUrl);
};

const getNewPosts = (state) => {
  const promises = state.rssContent.feeds.map(({ link, feedId }) =>
    getAxiosResponse(link).then((response) => {
      const { posts } = parser(response.data.contents);
      console.log(posts);
      const addedPosts = state.rssContent.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
      if (newPosts.length > 0) {
        createPosts(state, newPosts, feedId);
      }
      return Promise.resolve();
    }),
  );

  Promise.allSettled(promises).finally(() => {
    setTimeout(() => getNewPosts(state), 1000);
  });
};
export { getNewPosts };

export default () => {
  const initialState = {
    activeLanguage: 'ru',
    rssForm: {
      valid: true,
      process: {
        processState: 'pending',
        error: '',
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
    const input = rssForm.querySelector('#url-input');
    const url = input.value;
    const { visitedLinksIds } = initialState.uiState;
    const postsEl = document.querySelector('.posts');
    const feedsEl = document.querySelector('.feeds');
    const feedbackEl = document.querySelector('.feedback');
    const elements = { postsEl, feedsEl, feedbackEl };
    const i18nextInstance = createI18NextInstance(initialState.activeLanguage, resources);
    const watchedState = rssWatcher(initialState, render, elements, initialState, i18nextInstance);
    getNewPosts(watchedState);
    validate(url, visitedLinksIds)
      .then((validUrl) => {
        visitedLinksIds.add(validUrl);
        watchedState.rssForm.valid = true;
      })
      .catch((e) => {
        initialState.rssForm.process.error = e;
        watchedState.rssForm.valid = false;
      });
  });
};
