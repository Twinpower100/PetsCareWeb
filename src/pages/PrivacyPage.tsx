import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Страница политики конфиденциальности
 * Содержит информацию о сборе, использовании и защите персональных данных
 */
const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('legal.privacyTitle')}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              {t('legal.privacyLastUpdated')}: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('legal.privacySection1Title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('legal.privacySection1Content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('legal.privacySection2Title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('legal.privacySection2Content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('legal.privacySection3Title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('legal.privacySection3Content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('legal.privacySection4Title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('legal.privacySection4Content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('legal.privacySection5Title')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('legal.privacySection5Content')}
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {t('legal.privacyContact')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
