/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable function-paren-newline */
/* eslint-disable newline-per-chained-call */
import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
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
      post.feedId = feedId;
      post.id = _.uniqueId();
      post.readOut = false;
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

  const feedSection = document.querySelector('.feeds');
  const postSection = document.querySelector('.posts');
  const modalWindow = document.querySelector('.modal-content');
  const feedbackEl = document.querySelector('.feedback');
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');
  const elements = { input, feedbackEl, feedSection, postSection, modalWindow };

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentUrl = input.value;
    const watchedState = onChange(initialState, () => render(elements, initialState, i18nInstance));
    const feedLinks = initialState.content.feeds.map((feed) => feed.link);
    validate(currentUrl, feedLinks)
      .then((validUrl) => {
        getNewPosts(watchedState);
        getAxiosResponse(validUrl)
          .then((response) => {
            try {
              const { posts, feed } = parser(response.data.contents);
              const feedId = _.uniqueId();
              createPosts(initialState, posts, feedId);
              initialState.content.feeds.push({ ...feed, feedId, link: validUrl });
              initialState.valid = true;
              watchedState.process.processState = 'finished';
              const postLinks = postSection.querySelectorAll('li');
              return postLinks;
            } catch (e) {
              initialState.valid = false;
              initialState.process.error = e;
              watchedState.process.processState = 'finished';
            }
          })
          .then((posts) => {
            posts.forEach((post) => {
              post.childNodes.forEach((postChild) => {
                postChild.addEventListener('click', () => {
                  const id = postChild.getAttribute('data-id');
                  const watchedPosts = onChange(initialState.uiState.visitedLinksIds, () => {
                    const currentElements = document.querySelectorAll(`[data-id="${id}"]`);
                    currentElements.forEach((element) => {
                      element.classList.remove('fw-bold');
                      element.classList.add('fw-normal', 'link-secondary');
                    });
                  });
                  watchedPosts.add(id);
                });
              });
            });
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
