// i18n.ts
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [ 'querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain' ],
      caches: [ 'cookie' ],
    },
    resources: {
      en: {
        translation: require('./public/locales/en/translation.json'),
      },
      ja: {
        translation: require('./public/locales/ja/translation.json'),
      },
    },
  });

export default i18n;
