import rssParser from './rssParser.js';
import rssRequest from './rssRequest.js';

const buildContentBlock = (blockName, section) => {
  try {
    const elementBlock = document.createElement('div');
    elementBlock.classList.add('card', 'border-0');
    const HeaderDiv = document.createElement('div');
    HeaderDiv.classList.add('card-body');
    HeaderDiv.innerHTML = `<h2 class="card-title h4">${blockName}</h2>`;
    const contentList = document.createElement('ul');
    contentList.classList.add('list-group', 'border-0', 'rounded-0');
    elementBlock.append(HeaderDiv, contentList);
    section.append(elementBlock);
  } catch (e) {
    throw new Error('error in contentBlocks buildng');
  }
};

const buildList = (element, context) => {
  const parent = element.closest('.col-md-10');
  const parentName = Array.from(parent.classList).pop();
  const { feedTitle, feedDescription, posts } = context;
  switch (parentName) {
    case 'feeds': {
      const liElement = document.createElement('li');
      const titleHeader = document.createElement('h3');
      const descrtPar = document.createElement('p');

      liElement.classList.add('list-group-item', 'border-0', 'border-end-0');
      titleHeader.classList.add('h6', 'm-0');
      descrtPar.classList.add('m-0', 'small', 'text-black-50');
      titleHeader.textContent = feedTitle.textContent;
      descrtPar.textContent = feedDescription.textContent;

      liElement.append(titleHeader, descrtPar);
      element.append(liElement);
      break;
    }
    case 'posts': {
      const { document } = window;
      posts.forEach((post) => {
        const liElement = document.createElement('li');
        const { content } = post;
        const postTitle = content.querySelector('title');
        const postDescr = content.querySelector('description');
        const postLink = content.querySelector('link');
        const postButton = document.createElement('button');
        liElement.classList.add(
          'list-group-item',
          'd-flex',
          'justify-content-between',
          'align-items-start',
          'border-0',
          'border-end-0',
        );
        const linkToPost = document.createElement('a');
        linkToPost.setAttribute('href', postLink.textContent);
        linkToPost.textContent = postTitle.textContent;
        linkToPost.classList.add('fw-bold');
        linkToPost.setAttribute('data-id', 2);
        linkToPost.setAttribute('target', '_blank');
        linkToPost.setAttribute('rel', 'noopener noreferrer');

        postButton.setAttribute('type', 'button');
        postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        postButton.setAttribute('data-id', '2');
        postButton.setAttribute('data-bs-toggle', 'modal');
        postButton.setAttribute('data-bs-target', '#modal');
        postButton.textContent = 'Просмотр';
        postButton.addEventListener('click', (e) => {
          e.preventDefault();
          const { parentElement } = e.target;
          const currentLink = parentElement.querySelector('a');
          const modalWindow = document.querySelector('.modal-content');
          const modalTitle = modalWindow.querySelector('.modal-title');
          const modalDescription = modalWindow.querySelector('.modal-body');
          const modalFooter = modalWindow.querySelector('.modal-footer');
          const readMoreButton = modalFooter.querySelector('a');
          readMoreButton.href = currentLink.href;
          modalTitle.textContent = postTitle.textContent;
          modalDescription.textContent = postDescr.textContent;
        });
        liElement.append(linkToPost, postButton);
        element.append(liElement);
      });
      break;
    }
    default: {
      throw new Error('Wrong Element!');
    }
  }
};

const buildRssContent = (parsedData, state) => {
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

const renderRssFlow = (context) => {
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

export default (error, form, state) => {
  const i18n = state.dictionary.i18nextInstance;
  const input = form.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  if (error.type === 'url' || error.type === 'rss' || error.type === 'duplicate') {
    feedbackEl.textContent = i18n.t(error.type);
    feedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else if (error.type === null) {
    const relevantRssUrl = input.value;
    rssRequest(relevantRssUrl)
      .then((respond) => rssParser(respond))
      .then((parsedData) => buildRssContent(parsedData, state))
      .then((rssContent) => renderRssFlow(rssContent, state));
    feedbackEl.textContent = i18n.t('validationURLSucess');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};
