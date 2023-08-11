export default (error, form, dictionary) => {
  const i18n = dictionary.i18nextInstance;
  const input = form.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  if (error.type === 'url' || error.type === 'rss' || error.type === 'duplicate') {
    feedbackEl.textContent = i18n.t(error.type);
    feedbackEl.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else if (error.type === null) {
    feedbackEl.textContent = i18n.t('validationURLSucess');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};
