import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.js';
import es from '../locales/es.js';

export const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n.use(initReactI18next);

export default i18n;
