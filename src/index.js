/* eslint-disable import/extensions */
import '../index.html';
import './stylesheets/index.scss';
import 'bootstrap';
import app from './application.js';

try {
  app();
} catch (e) {
  console.log(e);
}
