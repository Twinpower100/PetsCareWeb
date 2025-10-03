import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * Компонент подвала приложения
 * Содержит ссылки на основные разделы и контактную информацию
 */
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-2">🐾</div>
              <h3 className="text-xl font-bold">{t('header.title')}</h3>
            </div>
            <p className="text-gray-400">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  {t('footer.allServices')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  {t('footer.findServices')}
                </Link>
              </li>
              <li>
                <Link to="/providers" className="hover:text-white transition-colors">
                  {t('footer.providers')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.connect')}</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.facebook')}
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.twitter')}
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.instagram')}
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
