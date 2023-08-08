import * as yup from 'yup';

const setState = (objectName) => {
  const state = { [objectName]: {} };
  return state;
};

const setRssSchema = (feesList) =>
  yup.object().shape({
    newLink: yup
      .string()
      .url('Must be a valid URL')
      .test('Must have .rss link format', 'Ресурс не содержит валидный RSS', (value) =>
        /\.rss$/i.test(value))
      .test(
        'Must not be listed in feeList',
        'RSS уже существует',
        (value) => !feesList.includes(value),
      ),
  });

const renderForm = (state, element) => {
  const validation = state.rssForm.validation.valid;
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
    default: {
      throw new Error('Wrong state property');
    }
  }
};

export { setState, setRssSchema, renderForm };
