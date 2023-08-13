export default (parsedData) => {
  const currentTitle = parsedData.querySelector('title');
  const currentDisc = parsedData.querySelector('description');

  const { document } = window;
  const feedsBlock = document.querySelector('.feeds');
  const postsBlock = document.querySelector('.posts');
  const rssFlowBlock = feedsBlock.parentNode;

  const feedsContent = document.createElement('div');
  feedsContent.classList.add('card', 'border-0');

  const firstRound = feedsBlock.firstChild === null;

  if (firstRound) {
    const feedsHeaderDiv = document.createElement('div');
    feedsHeaderDiv.classList.add('card-body');
    feedsHeaderDiv.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
    feedsContent.append(feedsHeaderDiv);
    feedsBlock.append(feedsContent);
    const feedsUl = document.createElement('ul');
    feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
    feedsContent.append(feedsUl);
  }
  const newLi = document.createElement('li');
  newLi.classList.add('list-group-item', 'border-0', 'border-end-0');
  newLi.innerHTML = `<h3 class="h6 m-0">${currentTitle.textContent}</h3><p class="m-0 small text-black-50">${currentDisc.textContent}</p>`;
  feedsBlock.querySelector('.list-group').append(newLi);
};
