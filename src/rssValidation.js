import * as yup from 'yup';

export default (feesList, i18nextInstance) =>
  yup.object().shape({
    link: yup
      .string()
      .url()
      .test('rss', 'no rss content', (value) => /\.rss$/i.test(value))
      .test('duplicate', i18nextInstance.t('notUniqRss'), (value) => !feesList.includes(value)),
  });
