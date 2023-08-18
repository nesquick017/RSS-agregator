/* eslint-disable no-unused-vars */
import onChange from 'on-change';
import { getAxiosResponse } from '../application.js';
import rssParser from '../rssParser.js';

const createPosts = (state, newPosts, feedId) =>
  state.rssContent.posts.push({ feedId, ...newPosts });

const getNewPosts = (state) => {
  const promises = state.rssContent.feeds.map(({ link, feedId }) =>
    getAxiosResponse(link)
      .then((response) => {
        console.log(response);
        const { posts } = rssParser(response.data.contents);
        const addedPosts = state.rssContent.posts.map((post) => post.link);
        const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
        if (newPosts.length > 0) {
          createPosts(state, newPosts, feedId);
        }
        return Promise.resolve();
      })
      .catch((e) => console.log(e)),
  );

  Promise.allSettled(promises).finally(() => {
    setTimeout(() => getNewPosts(state), 300);
  });
};

export default (initialState) => {
  const watchedData = onChange(initialState, (path, value) => {
    const { visitedLinksIds } = initialState.uiState;
    const url = initialState.rssForm.process.value;
    const feedId = visitedLinksIds.size;
    visitedLinksIds.add(url);
    getAxiosResponse(url).then((response) => {
      const { feed, posts } = rssParser(response.data.contents);
      initialState.rssContent.feeds.push({ feedId, feed, link: url });
      initialState.rssContent.posts.push({ feedId, posts });
    });
  });
  getNewPosts(watchedData);
  return watchedData;
};
