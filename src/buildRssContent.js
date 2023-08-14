export default (parsedData, state) => {
  const feedTitle = parsedData.querySelector('title');
  const feedDescription = parsedData.querySelector('description');
  const { rssContent } = state;
  const newFeedId = rssContent.empty ? 1 : Number(Object.keys(rssContent.feeds).pop()) + 1;
  rssContent.feeds[newFeedId] = { posts: [], feedTitle, feedDescription };
  rssContent.empty = false;
  const parsedPostsList = Array.from(parsedData.querySelectorAll('item'));
  parsedPostsList.forEach((post) => {
    const id = rssContent.feeds[newFeedId].posts.length + 1;
    rssContent.feeds[newFeedId].posts.push({ id, content: post });
  });
  return state.rssContent.feeds[newFeedId];
};
