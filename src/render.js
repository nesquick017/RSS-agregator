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
    const messageValue = error.code ?? error.message;
    const feedbackText = i18nextInstance.t(messageValue);
    return feedbackText;
  }
  return i18nextInstance.t('submit');
};

const renderButton = (state) => {
  const submitButton = document.querySelector('button[type="submit"]');
  if (state.process.processState !== 'finished') {
    submitButton.classList.add('disabled');
  } else {
    submitButton.classList.remove('disabled');
  }
};

export default (elements, state, i18nextInstance, path) => {
  const { input, feedbackEl, feedSection, postSection, modalWindow } = elements;
  const { valid } = state;
  switch (path) {
    case 'process.processState': {
      renderButton(state);
      break;
    }
    case 'valid': {
      input.value = '';
      input.focus();
      break;
    }
    case 'process.error': {
      const feedbackText = getFeedback(state, i18nextInstance);
      if (valid) {
        feedbackEl.classList.remove('is-invalid', 'text-danger');
        feedbackEl.classList.add('text-success');
      } else {
        feedbackEl.classList.remove('text-success');
        feedbackEl.classList.add('is-invalid', 'text-danger');
      }
      feedbackEl.textContent = feedbackText;
      break;
    }
    case 'content.posts': {
      const firstRound = feedSection.childNodes.length === 0;
      if (firstRound) {
        const feedsBlock = buildContentBlock('Фиды');
        feedSection.append(feedsBlock);
        const postsBlock = buildContentBlock('Посты');
        postSection.append(postsBlock);
      }
      const postsList = postSection.querySelector('ul');
      const view = renderPosts(state, modalWindow);
      postsList.replaceChildren(...view);
      break;
    }
    case 'content.feeds': {
      const feedsList = feedSection.querySelector('ul');
      const view = renderFeeds(state);
      feedsList.replaceChildren(...view);
      break;
    }
    case 'uiState.visitedLinksIds': {
      state.uiState.visitedLinksIds.forEach((id) => {
        const visitedLink = document.querySelector(`a[data-id="${id}"]`);
        visitedLink.classList.remove('fw-bold');
        visitedLink.classList.add('fw-normal', 'link-secondary');
      });
      break;
    }
    case 'process.value': {
      break;
    }
    default: {
      throw new Error('Unexpected changes in state!');
    }
  }
};
