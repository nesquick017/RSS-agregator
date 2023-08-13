import rssParser from './rssParser.js';
import rssRequest from './rssRequest.js';

export default (error, form, dictionary) => {
  const i18n = dictionary.i18nextInstance;
  const input = form.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  if (error.type === 'url' || error.type === 'rss' || error.type === 'duplicate') {
    feedbackEl.textContent = i18n.t(error.type);
    feedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else if (error.type === null) {
    const relevantRssUrl = input.value;
    rssRequest(relevantRssUrl).then((data) => rssParser(data));
    feedbackEl.textContent = i18n.t('validationURLSucess');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};
