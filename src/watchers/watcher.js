/* eslint-disable no-unused-vars */
import axios from 'axios';
import onChange from 'on-change';

export default (initialState, callback) => {
  const { getAxiosResponse } = initialState;
  const watchedData = onChange(initialState, (path, value) => {
    const { rssForm } = initialState;
    if (rssForm.valid) {
      setInterval(() => {
        getAxiosResponse(rssForm.value).then((responde) => console.log(responde.data));
      }, 5000);
    }
    callback();
  });
  return watchedData;
};

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
