/* eslint-disable no-unused-vars */
// const buildContentBlock = (blockName, section) => {
//   try {
//     const elementBlock = document.createElement('div');
//     elementBlock.classList.add('card', 'border-0');
//     const HeaderDiv = document.createElement('div');
//     HeaderDiv.classList.add('card-body');
//     HeaderDiv.innerHTML = `<h2 class="card-title h4">${blockName}</h2>`;
//     const contentList = document.createElement('ul');
//     contentList.classList.add('list-group', 'border-0', 'rounded-0');
//     elementBlock.append(HeaderDiv, contentList);
//     section.append(elementBlock);
//   } catch (e) {
//     throw new Error('error in contentBlocks buildng');
//   }
// };

// const renderRssSection = () => {
//   const { document } = window;
//   const postsSection = document.querySelector('.posts');
//   const feedsSection = document.querySelector('.feeds');

//   if (postsSection.childElementCount) return;

//   buildContentBlock('Посты', postsSection);
//   buildContentBlock('Фиды', feedsSection);
// };

// const buildList = (contentSection, initialState) => {
//   const { document } = window;
//   const { feeds, posts } = initialState.rssContent;
//   const currentContentUl = contentSection.querySelector('ul');
//   const parent = contentSection.closest('.col-md-10');
//   const parentName = Array.from(parent.classList).pop();
//   const currentFeedsId = feeds.length - 1;
//   switch (parentName) {
//     case 'feeds': {
//       const currentFeed = feeds[currentFeedsId];
//       const { title, description } = currentFeed.content;
//       const newFeed = document.createElement('li');
//       const newFeedTitle = document.createElement('h3');
//       const newFeedDescription = document.createElement('p');
//       newFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
//       newFeedTitle.classList.add('h6', 'm-0');
//       newFeedDescription.classList.add('m-0', 'small', 'text-black-50');
//       newFeedTitle.textContent = title.textContent;
//       newFeedDescription.textContent = description.textContent;
//       newFeed.append(newFeedTitle, newFeedDescription);
//       currentContentUl.prepend(newFeed);
//       break;
//     }
//     case 'posts': {
//       const newPosts = posts.filter((post) => post.feedId === currentFeedsId);
//       const newContent = [];
//       newPosts.forEach((post) => {
//         const newPost = document.createElement('li');
//         const { title, description, link } = post.content;
//         const postButton = document.createElement('button');
//         const newLink = document.createElement('a');
//         newLink.setAttribute('href', link);
//         newPost.classList.add(
//           'list-group-item',
//           'd-flex',
//           'justify-content-between',
//           'align-items-start',
//           'border-0',
//           'border-end-0',
//         );
//         newLink.textContent = title.textContent;
//         newLink.classList.add('fw-bold');
//         newLink.setAttribute('data-id', 2);
//         newLink.setAttribute('target', '_blank');
//         newLink.setAttribute('rel', 'noopener noreferrer');

//         postButton.setAttribute('type', 'button');
//         postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
//         postButton.setAttribute('data-id', '2');
//         postButton.setAttribute('data-bs-toggle', 'modal');
//         postButton.setAttribute('data-bs-target', '#modal');
//         postButton.textContent = 'Просмотр';
//         postButton.addEventListener('click', (e) => {
//           e.preventDefault();
//           const { parentElement } = e.target;
//           const currentLink = parentElement.querySelector('a');
//           const modalWindow = document.querySelector('.modal-content');
//           const modalTitle = modalWindow.querySelector('.modal-title');
//           const modalDescription = modalWindow.querySelector('.modal-body');
//           const modalFooter = modalWindow.querySelector('.modal-footer');
//           const readMoreButton = modalFooter.querySelector('a');
//           readMoreButton.href = currentLink.href;
//           modalTitle.textContent = title.textContent;
//           modalDescription.textContent = description.textContent;
//         });
//         newPost.append(newLink, postButton);
//         newContent.push(newPost);
//       });
//       currentContentUl.prepend(...newContent);
//       break;
//     }
//     default: {
//       throw new Error('Error in render, parentName is wrong! => ', parentName);
//     }
//   }
// };

// export default (initialState) => {
//   const { i18nInstance } = initialState;
//   const { error } = initialState.rssForm.process;
//   const { document } = window;
//   const rssForm = document.querySelector('.rss-form');
//   const input = rssForm.querySelector('#url-input');
//   const feedbackEl = document.querySelector('.feedback');

//   if (error.type === 'url' || error.type === 'rss' || error.type === 'notOneOf') {
//     feedbackEl.textContent = i18nInstance.t(error.type);
//     feedbackEl.classList.add('text-danger');
//     input.classList.add('is-invalid');
//   } else if (!error.type) {
//     input.classList.remove('is-invalid');
//     feedbackEl.classList.remove('text-danger');
//     feedbackEl.classList.add('text-success');
//     feedbackEl.textContent = i18nInstance.t('submit');
//     input.value = '';
//     input.focus();
//     renderRssSection();
//     const [feedsList, postsList] = [
//       document.querySelector('.feeds'),
//       document.querySelector('.posts'),
//     ];
//     buildList(feedsList, initialState);
//     buildList(postsList, initialState);
//   }
// };

const renderFeedback = (elements, state, i18nextInstance) => {
  const { feedbackEl, input } = elements;
  const { valid } = state;
  switch (valid) {
    case true: {
      feedbackEl.classList.remove('is-invalid', 'text-danger');
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = i18nextInstance.t('submit');
      console.log(i18nextInstance.t('submit'));
      input.value = '';
      input.focus();
      break;
    }
    case false: {
      feedbackEl.classList.add('is-invalid', 'text-danger');
      feedbackEl.classList.remove('text-success');
      console.log(state.process.error.type, 123);
      feedbackEl.textContent = i18nextInstance.t(state.process.error.type);
      console.log(i18nextInstance.t(state.process.error.type));
      break;
    }
    default: {
      console.log('error with validation value');
    }
  }
};

export default (elements, initialState, i18nextInstance) => {
  const { postsContainer, feedsContainer, modal } = elements;
  const { rssContent } = initialState;
  renderFeedback(elements, initialState, i18nextInstance);
};
