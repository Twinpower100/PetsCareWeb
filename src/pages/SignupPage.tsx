import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { googleAuthService, GoogleCredentialResponse } from '../services/googleAuth';
import { validationAPI } from '../services/validationAPI';

/**
 * Страница регистрации нового пользователя
 * Позволяет создать новый аккаунт в системе
 */
const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, googleSignup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: ''
  });
  const [timeouts, setTimeouts] = useState<{
    email: NodeJS.Timeout | null;
    phone: NodeJS.Timeout | null;
  }>({
    email: null,
    phone: null
  });

  // Очистка timeout при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timeouts.email) clearTimeout(timeouts.email);
      if (timeouts.phone) clearTimeout(timeouts.phone);
    };
  }, [timeouts.email, timeouts.phone]);

  // AJAX проверка email
  const validateEmail = async (email: string) => {
    if (!email || !email.includes('@')) return;
    
    setValidationErrors(prev => ({ ...prev, email: '' }));
    
    try {
      const result = await validationAPI.checkEmail(email);
      if (result.exists) {
        setValidationErrors(prev => ({ ...prev, email: t('auth.emailExists') }));
      } else if (!result.valid) {
        setValidationErrors(prev => ({ ...prev, email: t('auth.invalidEmailFormat') }));
      }
    } catch (error) {
      console.error('Email validation error:', error);
    } finally {
      // Валидация завершена
    }
  };

  // AJAX проверка телефона
  const validatePhone = async (phone: string) => {
    if (!phone || phone.length < 8) return;
    
    setValidationErrors(prev => ({ ...prev, phone: '' }));
    
    try {
      const result = await validationAPI.checkPhone(phone);
      if (result.exists) {
        setValidationErrors(prev => ({ ...prev, phone: t('auth.phoneExists') }));
      } else if (!result.valid) {
        setValidationErrors(prev => ({ ...prev, phone: t('auth.invalidPhoneFormat') }));
      }
    } catch (error) {
      console.error('Phone validation error:', error);
    } finally {
      // Валидация завершена
    }
  };

  // Обработка изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // AJAX проверки в реальном времени с debounce
    if (name === 'email') {
      if (timeouts.email) clearTimeout(timeouts.email);
      const timeoutId = setTimeout(() => validateEmail(value), 800);
      setTimeouts(prev => ({ ...prev, email: timeoutId }));
    }
    if (name === 'phone') {
      if (timeouts.phone) clearTimeout(timeouts.phone);
      const timeoutId = setTimeout(() => validatePhone(value), 1000);
      setTimeouts(prev => ({ ...prev, phone: timeoutId }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError(t('auth.firstNameRequired'));
      return false;
    }
    if (!formData.lastName.trim()) {
      setError(t('auth.lastNameRequired'));
      return false;
    }
    if (!formData.phone.trim()) {
      setError(t('auth.phoneRequired'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return false;
    }
    if (!formData.agreeToTerms) {
      setError(t('auth.mustAgreeToTerms'));
      return false;
    }
    
    // Проверяем ошибки AJAX валидации
    if (validationErrors.email || validationErrors.phone) {
      setError(t('auth.pleaseFixValidationErrors'));
      return false;
    }
    
    return true;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName || '',
        last_name: formData.lastName || '',
        phone_number: formData.phone || undefined,
      };

      await signup(userData);
      // Перенаправляем на главную страницу
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      
      // Обрабатываем конкретные ошибки валидации
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes('phone_number:')) {
          const phoneError = errorMessage.replace('phone_number: ', '');
          setValidationErrors(prev => ({ ...prev, phone: phoneError }));
        } else if (errorMessage.includes('email:')) {
          const emailError = errorMessage.replace('email: ', '');
          setValidationErrors(prev => ({ ...prev, email: emailError }));
        } else if (errorMessage.includes('first_name:')) {
          setError(errorMessage.replace('first_name: ', ''));
        } else if (errorMessage.includes('last_name:')) {
          setError(errorMessage.replace('last_name: ', ''));
        } else {
          setError(t('auth.signupError'));
        }
      } else {
        setError(t('auth.signupError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка регистрации через Google
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      await googleAuthService.showPopup(async (response: GoogleCredentialResponse) => {
        try {
          const googleToken = googleAuthService.getJwtToken(response);
          console.log('Google credential received:', googleToken);
          
          const result = await googleSignup(googleToken);
          if (result.needsCompletion) {
            navigate('/complete-google-signup');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Google signup error:', error);
          setError(t('auth.googleSignupError'));
        } finally {
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError(t('auth.googleSignupError'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.signupTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.signupSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  {t('auth.firstName')} <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('auth.firstNamePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  {t('auth.lastName')} <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t('auth.lastNamePlaceholder')}
                  />
                </div>
              </div>
            </div>


            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                />
                {validationErrors.email && (
                  <div className="mt-1 text-sm text-red-600">{validationErrors.email}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('auth.phone')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                <div className="mt-1 text-sm text-gray-500">
                  {t('auth.phoneFormat')}
                </div>
                {validationErrors.phone && (
                  <div className="mt-1 text-sm text-red-600">{validationErrors.phone}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t('auth.passwordPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                {t('auth.confirmPassword')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                {t('auth.agreeToTerms')}{' '}
                <a
                  href="/legal/terms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {t('auth.termsOfService')}
                </a>
                {' '}{t('common.and')}{' '}
                <a
                  href="/legal/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {t('auth.privacyPolicy')}
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('common.loading') : t('auth.signupButton')}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">{t('auth.signupWithGoogle')}</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                {t('auth.haveAccount')}{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('auth.loginLink')}
                </Link>
              </span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> {t('auth.requiredFields')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
