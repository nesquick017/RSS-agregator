/* eslint-disable no-unused-vars */
export default (element, context) => {
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
        const { content, id } = post;
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
