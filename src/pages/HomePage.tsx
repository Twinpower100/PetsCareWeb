import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Главная страница приложения PetCare
 * Отображает основную информацию о сервисе и его возможностях
 */
const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
            <span className="block text-primary-600">{t('hero.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors">
              {t('hero.findServices')}
            </button>
            <button className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors">
              {t('hero.learnMore')}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('features.easyBooking.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.easyBooking.description')}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('features.healthTracking.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.healthTracking.description')}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('features.expertAdvice.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.expertAdvice.description')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
