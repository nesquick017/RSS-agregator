import buildContentBlock from './buildContentBlock.js';
import buildFeedsList from './buildFeedsList.js';
import buildPostsList from './buildPostsList.js';

export default (parsedData) => {
  const { document } = window;
  const feedsBlock = document.querySelector('.feeds');
  const postsBlock = document.querySelector('.posts');

  const firstRound = Array.from(postsBlock.children).length === 0;

  if (firstRound) {
    const feedsContent = buildContentBlock('Фиды');
    const postsContent = buildContentBlock('Посты');
    feedsBlock.append(feedsContent);
    postsBlock.append(postsContent);
  }

  buildFeedsList(feedsBlock, parsedData);
  buildPostsList(postsBlock, parsedData);
};
