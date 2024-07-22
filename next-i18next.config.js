// next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    locales: [ 'en', 'ja' ],
    defaultLocale: 'en',
  },
  localePath: path.resolve('./public/locales'),
};
