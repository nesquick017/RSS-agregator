export default (element, parsedData) => {
  const title = parsedData.querySelector('title').textContent;
  const discr = parsedData.querySelector('description').textContent;
  const feedsUl = element.querySelector('ul');
  const newLi = document.createElement('li');
  newLi.classList.add('list-group-item', 'border-0', 'border-end-0');
  const feedHeader = document.createElement('h3');
  const feedPar = document.createElement('p');
  feedHeader.classList.add('h6', 'm-0');
  feedPar.classList.add('m-0', 'small', 'text-black-50');
  feedPar.textContent = discr;
  feedHeader.textContent = title;
  newLi.append(feedHeader, feedPar);
  feedsUl.append(newLi);
};
