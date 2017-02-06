import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  actual: '0.x',
  express: '4.x',
  helmet: '3.x',
  intl: '1.2.5',
  lodash: '4.x',
  logatim: '0.x',
  moment: '2.x',
  'react-dom': '15.x',
  'react-helmet': '4.x',
  'react-intl': '2.2.x',
  'react-intl-redux': '0.3.x',
  'react-redux': '5.x',
  'react-router-dom': '4.0.0-beta.3',
  receptacle: '1.x',
  redux: '3.x',
  useragent: '2.1.x',
  'url-pattern': '1.x',
  winston: '2.x',
}, 'ssrwpo:ssr');
