import * as yup from 'yup';

export default (feesList) =>
  yup.object().shape({
    link: yup
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
