export default (state, element) => {
  const validation = state.rssForm.input.valid;
  console.log(element);
  switch (validation) {
    case true: {
      element.classList.remove('is-invalid');
      break;
    }
    case false: {
      element.classList.add('is-invalid');
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
