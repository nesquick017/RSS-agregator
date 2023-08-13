export default (parsedData) => {
  const flowTitle = parsedData.querySelector('title');
  const flowDisc = parsedData.querySelector('description');

  const { document } = window;
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const rssFlowBlock = feeds.parentNode;

  feeds.innerHTML = `<div class="card border-0">
  <div class="card-body">
    <h2 class="card-title h4">Фиды</h2>
  </div>
  <ul class="list-group border-0 rounded-0">
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${flowTitle.textContent}</h3>
      <p class="m-0 small text-black-50">${flowDisc.textContent}</p>
    </li>
  </ul>
</div>`;
};
