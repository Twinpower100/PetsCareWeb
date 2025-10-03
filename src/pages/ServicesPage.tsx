import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useServiceCategories } from '../hooks/useServiceCategories';
import { catalogAPI } from '../services/catalogAPI';

/**
 * Страница услуг PetCare
 * Показывает информацию о том, как работает агрегатор
 * Направляет пользователей к поиску услуг
 */
const ServicesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { categories, loading, error } = useServiceCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('navigation.services')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.heroDescription')}
          </p>
        </div>
      </div>

      {/* Service Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('services.categoriesTitle')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.categoriesDescription')}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('common.loading')}...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">
              {t('common.error')}: {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Service Categories */}
        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.code}`}
                className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4 text-center">
                  {category.icon || '🐾'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {catalogAPI.getLocalizedName(category, i18n.language)}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {t('services.noCategories')}
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('services.howItWorksTitle')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.howItWorksDescription')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('services.step1Title')}
            </h3>
            <p className="text-gray-600">
              {t('services.step1Description')}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('services.step2Title')}
            </h3>
            <p className="text-gray-600">
              {t('services.step2Description')}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('services.step3Title')}
            </h3>
            <p className="text-gray-600">
              {t('services.step3Description')}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('services.ctaTitle')}
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('services.ctaDescription')}
          </p>
          <Link
            to="/search"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {t('services.findServices')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;