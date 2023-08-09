export default (state, form) => {
  const validation = state.rssForm.input.valid;
  const input = form.querySelector('input[type="text"]');
  switch (validation) {
    case false: {
      input.classList.add('is-invalid');
      const errorParagraph = document.createElement('p');
      const classList = 'feedback m-0 position-absolute small text-danger';
      classList.split(' ').forEach((el) => errorParagraph.classList.add(el));
      errorParagraph.textContent = state.rssForm.input.errors;
      form.parentNode.append(errorParagraph);
      break;
    }
    case true: {
      console.log('all good', input);
      const activeFeedback = document.querySelector('.feedback');
      input.classList.remove('is-invalid');
      activeFeedback.remove();
      break;
    }
    case null: {
      break;
    }
    default: {
      throw new Error('Wrong state property');
    }
  }
};
