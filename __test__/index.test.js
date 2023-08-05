/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import strGen from '../src/defaultFile';

test('empty test', () => {
  expect(strGen()).toBe(true);
});
