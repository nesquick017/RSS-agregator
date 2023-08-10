export default (state, form) => {
  const { dictionary } = state;
  console.log(dictionary);
  const feedback = document.querySelector('.feedback');
  const input = form.querySelector('#url-input');
  switch (state.rssForm.input.valid) {
    case false: {
      input.classList.add('is-invalid');
      feedback.textContent = dictionary.i18nextInstance.t('validationURLError');
      break;
    }
    case true: {
      feedback.textContent = dictionary.i18nextInstance.t('validationURLSucess');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      break;
    }
    default: {
      throw new Error('Wrong state property');
    }
  }
};
