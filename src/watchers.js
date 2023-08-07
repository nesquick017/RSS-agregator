import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';

export default (state) => {
  const rssSchema = yup.object().shape({
    newLink: yup
      .string()
      .url('url link to rss feed')
      .required('Your link must be a relevant link to rss feed'),
  });

  const watchedData = onChange(state, (path, value) => {
    rssSchema
      .validate({ newLink: value })
      .then(() => {
        _.set(state, `${path}.value`, value);
        _.set(state, `${path}.valid`, true);
      })
      .catch((e) => {
        console.log('Error, ', e);
        _.set(state, `${path}.value`, value);
        _.set(state, `${path}.valid`, false);
      });
  });
  return watchedData;
};
