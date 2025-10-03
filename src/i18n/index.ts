import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импорт переводов
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import meTranslations from './locales/me.json';
import deTranslations from './locales/de.json';

// Конфигурация i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Ресурсы переводов
    resources: {
      en: {
        translation: enTranslations
      },
      ru: {
        translation: ruTranslations
      },
      me: {
        translation: meTranslations
      },
      de: {
        translation: deTranslations
      }
    },
    
    // Язык по умолчанию
    fallbackLng: 'en',
    
    // Настройки детектора языка
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    // Настройки интерполяции
    interpolation: {
      escapeValue: false // React уже экранирует значения
    },
    
    // Настройки отладки (только для разработки)
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;
