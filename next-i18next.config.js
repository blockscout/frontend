// next-i18next.config.js
const path = require('path');

module.exports = {
  i18n: {
    locales: [ 'en', 'ja' ],
    defaultLocale: 'ja',
  },
  localePath: path.resolve('./public/locales'),
};
