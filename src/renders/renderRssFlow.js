import buildContentBlock from './buildContentBlock.js';
import buildList from './buildList.js';

export default (context) => {
  const { document } = window;
  const postsSection = document.querySelector('.posts');
  const feedsSection = document.querySelector('.feeds');

  const firstRound = !postsSection.childElementCount;
  if (firstRound) {
    buildContentBlock('Посты', postsSection);
    buildContentBlock('Фиды', feedsSection);
  }
  const feedUl = feedsSection.querySelector('ul');
  const postUl = postsSection.querySelector('ul');
  buildList(feedUl, context);
  buildList(postUl, context);
};
