/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable newline-per-chained-call */
import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import render from './render.js';
import parser from './rssParser.js';
import resources from './locales/index.js';

const app = (i18nInstance) => {
  const initialState = {
    valid: true,
    inputValue: '',
    process: {
      processState: 'filling',
      error: '',
    },
    content: {
      posts: [],
      feeds: [],
    },
    uiState: {
      visitedLinksIds: new Set(),
      modalId: '',
    },
  };

  const getAxiosResponse = (url) => {
    const allOrigins = 'https://allorigins.hexlet.app/get';
    const newUrl = new URL(allOrigins);
    newUrl.searchParams.set('url', url);
    newUrl.searchParams.set('disableCache', 'true');
    return axios.get(newUrl);
  };

  const validate = (url, urlList) => {
    const schema = yup.string().trim().required().url().notOneOf(urlList);
    return schema.validate(url);
  };

  const createPosts = (state, newPosts, feedId) => {
    newPosts.forEach((post) => {
      post.feeId = feedId;
    });
    state.content.posts.push(...newPosts);
  };

  const getNewPosts = (state) => {
    const promises = state.content.feeds.map(({ link, feedId }) =>
      getAxiosResponse(link)
        .then((response) => {
          const { posts } = parser(response.data.contents);
          const addedPosts = state.content.posts.map((post) => post.link);
          const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
          if (newPosts.length > 0) {
            createPosts(state, newPosts, feedId);
          }
          return Promise.resolve();
        })
        .catch((e) => console.log(e)),
    );

    Promise.allSettled(promises).finally(() => {
      setTimeout(() => getNewPosts(state), 5000);
    });
  };

  const rssForm = document.querySelector('.rss-form');
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = rssForm.querySelector('#url-input');
    const feedSection = document.querySelector('.feeds');
    const postSection = document.querySelector('.posts');
    const modalWindow = document.querySelector('.modal-content');
    const feedbackEl = document.querySelector('.feedback');
    const elements = { input, feedbackEl, feedSection, postSection, modalWindow };
    const currentUrl = input.value;
    const { visitedLinksIds } = initialState.uiState;
    const watchedState = onChange(initialState, () => render(elements, initialState, i18nInstance));
    validate(currentUrl, visitedLinksIds)
      .then((validUrl) => {
        getNewPosts(watchedState);
        getAxiosResponse(validUrl).then((response) => {
          try {
            const { posts, feed } = parser(response.data.contents);
            visitedLinksIds.add(validUrl);
            const feedId = visitedLinksIds.size;
            createPosts(initialState, posts, feedId);
            initialState.content.feeds.push({ ...feed, feedId, link: validUrl });
            initialState.valid = true;
            watchedState.process.processState = 'finished';
          } catch (e) {
            initialState.valid = false;
            initialState.process.error = e;
            watchedState.process.processState = 'finished';
          }
        });
      })
      .catch((e) => {
        initialState.valid = false;
        initialState.process.error = e;
        watchedState.process.processState = 'finished';
      });
  });
};

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({ lng: 'ru', resources });
  app(i18nextInstance);
};
