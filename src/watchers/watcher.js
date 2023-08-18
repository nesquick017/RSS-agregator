/* eslint-disable no-unused-vars */
import { getAxiosResponse } from '../application.js';
import onChange from 'on-change';
import rssParser from '../rssParser.js';

const createPosts = (state, newPosts, feedId) =>
  state.rssContent.posts.push({ feedId, ...newPosts });

const getNewPosts = (state) => {
  const promises = state.rssContent.feeds.map(({ link, feedId }) =>
    getAxiosResponse(link).then((response) => {
      console.log(response);
      const { posts } = parser(response.data.rssContent);
      const addedPosts = state.rssContent.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
      if (newPosts.length > 0) {
        createPosts(state, newPosts, feedId);
      }
      return Promise.resolve();
    }),
  );

  Promise.allSettled(promises).finally(() => {
    setTimeout(() => getNewPosts(state), 5000);
  });
};

export default (initialState) => {
  const watchedData = onChange(initialState, (path, value) => {
    const feedId = initialState.uiState.visitedLinksIds.size;
    initialState.uiState.visitedLinksIds.add(value);
    getAxiosResponse(value).then((response) => {
      const { feed, posts } = rssParser(response.data.contents);
      initialState.rssContent.feeds.push({ feedId, feed });
      initialState.rssContent.posts.push({ feedId, posts });
    });
    getNewPosts(watchedData);
  });
  return watchedData;
};
