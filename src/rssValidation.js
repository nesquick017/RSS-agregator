import * as yup from 'yup';

export default (feesList, i18nextInstance) =>
  yup.object().shape({
    link: yup
      .string()
      .url(i18nextInstance.t('validationURLError'))
      .test('Must have valid RSS', i18nextInstance.t('validationURLError'), (value) =>
        /\.rss$/i.test(value))
      .test(
        'Must not be listed in feeList',
        i18nextInstance.t('notUniqRss'),
        (value) => !feesList.includes(value),
      ),
  });
