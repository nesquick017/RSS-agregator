import rssParser from '../rssParser.js';
import rssRequest from '../rssRequest.js';
import buildRssContent from '../buildRssContent.js';
import renderRssFlow from './renderRssFlow.js';

export default (error, form, state) => {
  const i18n = state.dictionary.i18nextInstance;
  const input = form.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  if (error.type === 'url' || error.type === 'rss' || error.type === 'duplicate') {
    feedbackEl.textContent = i18n.t(error.type);
    feedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else if (error.type === null) {
    const relevantRssUrl = input.value;
    rssRequest(relevantRssUrl)
      .then((respond) => rssParser(respond))
      .then((parsedData) => buildRssContent(parsedData, state))
      .then((rssContent) => renderRssFlow(rssContent, state));
    feedbackEl.textContent = i18n.t('validationURLSucess');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};
