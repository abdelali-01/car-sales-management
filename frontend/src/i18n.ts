import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationAR from './locales/ar/translation.json';
import adminEN from './locales/en/admin.json';
import adminFR from './locales/fr/admin.json';
import adminAR from './locales/ar/admin.json';

const resources = {
  en: {
    translation: translationEN,
    admin: adminEN,
  },
  fr: {
    translation: translationFR,
    admin: adminFR,
  },
  ar: {
    translation: translationAR,
    admin: adminAR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: 'en',
    ns: ['translation', 'admin'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    }
  });

export default i18n;