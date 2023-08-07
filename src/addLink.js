import setState from './makeState.js';
import watchRss from './watchers.js';

export default () => {
  const state = setState('rssForm');
  const watchedState = watchRss(state);

  const rssForm = document.querySelector('.form-inline');
  const rssFromTextInput = rssForm.querySelector("input[type='text'");
  rssFromTextInput.focus();

  rssForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.rssForm.link = rssFromTextInput.value;
    //вот тут хочу дальше с кодом работать, а валидация не идет, потому что она не успевает закончится внутри watched.state
    rssFromTextInput.value = '';
  });
};
