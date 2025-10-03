import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Компонент заголовка приложения
 * Содержит навигацию, логотип и переключатель языков
 */
const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  /**
   * Проверяет, активна ли текущая ссылка
   * @param path - путь для проверки
   * @returns true если путь активен
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  /**
   * Обработчик выхода из системы
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-3xl mr-3">🐾</div>
            <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/services"
              className={`transition-colors ${
                isActive('/services')
                  ? 'text-primary-600 font-semibold'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {t('navigation.services')}
            </Link>
            <Link
              to="/about"
              className={`transition-colors ${
                isActive('/about')
                  ? 'text-primary-600 font-semibold'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {t('navigation.about')}
            </Link>
            <Link
              to="/contact"
              className={`transition-colors ${
                isActive('/contact')
                  ? 'text-primary-600 font-semibold'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {t('navigation.contact')}
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {t('navigation.welcome')}, {user?.first_name || user?.username}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('navigation.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
