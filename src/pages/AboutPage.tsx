import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Страница "О нас" PetCare
 * Предоставляет информацию о компании и миссии
 */
const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('navigation.about')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.missionTitle')}</h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('about.missionText1')}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              {t('about.missionText2')}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">{t('about.whyChooseTitle')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.verifiedProfessionals')}</h4>
                  <p className="text-gray-600">{t('about.verifiedProfessionalsDesc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="text-2xl mr-3">🔒</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.securePlatform')}</h4>
                  <p className="text-gray-600">{t('about.securePlatformDesc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="text-2xl mr-3">📱</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('about.easyBooking')}</h4>
                  <p className="text-gray-600">{t('about.easyBookingDesc')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
