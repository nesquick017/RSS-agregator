/* eslint-disable no-unused-vars */
import axios from 'axios';
import onChange from 'on-change';
import { getAxiosResponse } from '../application';
import rssParser from '../rssParser';

const getNewPosts = (state) => {
  const promises = state.content.feeds.map(({ link, feedId }) =>
    getAxiosResponse(link).then((response) => {
      const { posts } = parser(response.data.contents);
      const addedPosts = state.content.posts.map((post) => post.link);
      const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
      if (newPosts.length > 0) {
        createPosts(state, newPosts, feedId);
      }
      return Promise.resolve();
    }),
  );

  Promise.allSettled(promises).finally(() => {
    setTimeout(() => getNewPosts(state), timeout);
  });
};

export default (initialState, callback) => {
  const watchedData = onChange(initialState, (path, value) => {
    const feedId = initialState.uiState.visitedLinksIds.size;
    initialState.uiState.visitedLinksIds.add(value);
    getAxiosResponse(value).then((response) => {
      const feed = rssParser(response.data.contents);
      initialState.rssContent.feed.push({ feedId, ...feed });
      getNewPosts(initialState);
    });
  });
  return watchedData;
};
