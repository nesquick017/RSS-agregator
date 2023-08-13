export default (blockName) => {
  const elementBlock = document.createElement('div');
  elementBlock.classList.add('card', 'border-0');
  const HeaderDiv = document.createElement('div');
  HeaderDiv.classList.add('card-body');
  HeaderDiv.innerHTML = `<h2 class="card-title h4">${blockName}</h2>`;
  const contentList = document.createElement('ul');
  contentList.classList.add('list-group', 'border-0', 'rounded-0');
  elementBlock.append(HeaderDiv, contentList);
  return elementBlock;
};
