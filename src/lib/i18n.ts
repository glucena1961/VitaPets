import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from '../locales/en.js';
import es from '../locales/es.js';

export const resources = {
  en: { translation: en },
  es: { translation: es },
};

const STORE_LANGUAGE_KEY = 'selectedLanguage';

const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLang = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (storedLang) {
        return callback(storedLang);
      }
      // Si no hay idioma guardado, usar el del dispositivo
      const deviceLang = Localization.getLocales()[0].languageCode;
      return callback(deviceLang || 'es');
    } catch (error) {
      console.error('Error detecting language:', error);
      // Fallback a español si todo falla
      return callback('es');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    react: {
      useSuspense: false, // Evita el uso de React Suspense
    },
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar
    },
  });

export default i18n;
