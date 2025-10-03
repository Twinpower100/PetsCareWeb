import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Компонент для переключения языка интерфейса
 * Позволяет пользователю выбирать между английским и русским языками
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  /**
   * Обработчик изменения языка
   * @param languageCode - код языка (en/ru)
   */
  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label={t('language.switch')}
      >
        <option value="en">{t('language.english')}</option>
        <option value="ru">{t('language.russian')}</option>
        <option value="me">{t('language.montenegrian')}</option>
        <option value="de">{t('language.german')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
