export default (element, parsedData) => {
  const feedsUl = element.querySelector('ul');
  console.log(feedsUl);
  const parsedPostsList = Array.from(parsedData.querySelectorAll('item'));
  parsedPostsList.forEach((post) => {
    console.log(post);
    const postTitle = post.querySelector('title');
    const link = post.querySelector('link');
    const newLi = document.createElement('li');
    newLi.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const linkToPost = document.createElement('a');
    linkToPost.setAttribute('href', link.textContent);
    linkToPost.textContent = postTitle.textContent;
    linkToPost.classList.add('fw-bold');
    linkToPost.setAttribute('data-id', 2);
    linkToPost.setAttribute('target', '_blank');
    linkToPost.setAttribute('rel', 'noopener noreferrer');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-id', '2');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
    newLi.append(linkToPost);
    newLi.append(button);
    feedsUl.append(newLi);
  });
};
