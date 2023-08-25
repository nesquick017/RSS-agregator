/* eslint-disable object-curly-newline */

const renderPosts = (state, modalWindow) => {
  const { posts } = state.content;
  const content = posts.map((post) => {
    const { title, link, description, id } = post;

    const newPost = document.createElement('li');
    newPost.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const newPostLink = document.createElement('a');
    newPostLink.textContent = title;
    newPostLink.classList.add('fw-bold');
    newPost.classList.add('fw-bold');
    newPostLink.setAttribute('data-id', id);
    newPostLink.setAttribute('target', '_blank');
    newPostLink.setAttribute('rel', 'noopener noreferrer');
    newPostLink.setAttribute('href', link);

    const newPostButton = document.createElement('button');
    newPostButton.setAttribute('type', 'button');
    newPostButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    newPostButton.setAttribute('data-id', id);
    newPostButton.setAttribute('data-bs-toggle', 'modal');
    newPostButton.setAttribute('data-bs-target', '#modal');
    newPostButton.textContent = 'Просмотр';
    newPostButton.addEventListener('click', (e) => {
      e.preventDefault();
      const modalHeader = modalWindow.querySelector('.modal-header');
      modalHeader.textContent = title;

      const modalBody = modalWindow.querySelector('.modal-body');
      modalBody.textContent = description;

      const readMoreButton = modalWindow.querySelector('.full-article');
      readMoreButton.setAttribute('href', link);
    });

    newPost.append(newPostLink, newPostButton);
    return newPost;
  });

  return content;
};

const renderFeeds = (state) => {
  const { feeds } = state.content;
  const newFeeds = feeds.map((feed) => {
    const { title, description } = feed;
    const newFeed = document.createElement('li');
    newFeed.classList.add('list-group-item', 'border-0', 'border-end-0');

    const hTitle = document.createElement('h3');
    hTitle.classList.add('h6', 'm-0');
    hTitle.textContent = title;

    const pDescriotion = document.createElement('p');
    pDescriotion.classList.add('m-0', 'small', 'text-black-50');
    pDescriotion.textContent = description;

    newFeed.append(hTitle, pDescriotion);
    return newFeed;
  });
  return newFeeds;
};

const buildContentBlock = (blockName) => {
  const contentBlock = document.createElement('div');
  contentBlock.classList.add('card', 'border-0');
  const nameDiv = document.createElement('div');
  nameDiv.classList.add('card-body');
  nameDiv.innerHTML = `<h2 class="card-title h4">${blockName}</h2>`;
  const contentList = document.createElement('ul');
  contentList.classList.add('list-group', 'border-0', 'rounded-0');
  contentBlock.append(nameDiv, contentList);
  return contentBlock;
};

const getFeedback = (state, i18nextInstance) => {
  const { error } = state.process;
  if (error) {
    const feedbackText = i18nextInstance.t(error.type || error.message);
    return feedbackText;
  }
  const feedbackText = i18nextInstance.t('submit');
  return feedbackText;
};

const renderButton = (state) => {
  const submitButton = document.querySelector('button[type="submit"]');
  const { processState } = state.process;
  if (processState !== 'finished') {
    submitButton.classList.add('disabled');
  } else {
    submitButton.classList.remove('disabled');
  }
};

export default (elements, state, i18nextInstance) => {
  renderButton(state);
  if (state.process.processState === 'validation') return;
  const { input, feedbackEl, feedSection, postSection, modalWindow } = elements;
  const feedbackText = getFeedback(state, i18nextInstance);
  if (state.valid) {
    feedbackEl.classList.remove('is-invalid', 'text-danger');
    feedbackEl.classList.add('text-success');
    feedbackEl.textContent = feedbackText;
    input.textContent = '';
    input.focus();

    const firstRound = feedSection.childNodes.length === 0;

    if (firstRound) {
      const feedsBlock = buildContentBlock('Фиды');
      feedSection.append(feedsBlock);
      const postsBlock = buildContentBlock('Посты');
      postSection.append(postsBlock);
    }

    const feedsList = feedSection.querySelector('ul');
    const postsList = postSection.querySelector('ul');

    const posts = renderPosts(state, modalWindow);
    postsList.replaceChildren(...posts);

    const feeds = renderFeeds(state);
    feedsList.replaceChildren(...feeds);
  } else {
    feedbackEl.classList.remove('text-success');
    feedbackEl.classList.add('is-invalid', 'text-danger');
    feedbackEl.textContent = feedbackText;
    input.textContent = '';
    input.focus();
  }

  state.uiState.visitedLinksIds.forEach((id) => {
    const visitedLink = document.querySelector(`a[data-id="${id}"]`);
    visitedLink.classList.remove('fw-bold');
    visitedLink.classList.add('fw-normal', 'link-secondary');
  });
};
