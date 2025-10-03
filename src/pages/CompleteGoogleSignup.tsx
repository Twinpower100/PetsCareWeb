import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authAPI';

/**
 * Страница завершения регистрации для Google OAuth пользователей
 * Запрашивает обязательные поля: номер телефона
 */
const CompleteGoogleSignup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Валидация формата номера телефона
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setValidationErrors(prev => ({ ...prev, phone: t('auth.invalidPhoneFormat') }));
      setIsLoading(false);
      return;
    }
    
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      console.log('Updating user profile with phone number:', phoneNumber);
      
      // Обновляем профиль пользователя
      const updatedUser = await authAPI.updateProfile(accessToken, {
        phone_number: phoneNumber
      });
      
      console.log('Profile updated successfully:', updatedUser);
      navigate('/');
    } catch (err: any) {
      console.error('Profile update error:', err);
      console.error('Error message:', err.message);
      console.error('Error details:', err);
      
      // Обрабатываем конкретные ошибки валидации
      if (err.message && err.message.includes('phone_number:')) {
        const phoneError = err.message.replace('phone_number: ', '');
        setValidationErrors(prev => ({ ...prev, phone: phoneError }));
      } else if (err.message && err.message.includes('phone_number')) {
        // Ошибка уникальности номера телефона
        if (err.message.includes('already exists') || err.message.includes('unique') || err.message.includes('уже существует')) {
          setValidationErrors(prev => ({ ...prev, phone: t('auth.phoneNumberExists') }));
        } else {
          setValidationErrors(prev => ({ ...prev, phone: t('auth.invalidPhoneFormat') }));
        }
      } else if (err.message && (err.message.includes('already exists') || err.message.includes('уже существует'))) {
        // Общая ошибка уникальности
        setValidationErrors(prev => ({ ...prev, phone: t('auth.phoneNumberExists') }));
      } else {
        // Показываем детальную ошибку для отладки
        setError(err.message || t('auth.profileUpdateError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.completeSignup')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.completeSignupDescription')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                {t('auth.phone')} *
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? t('common.loading') : t('auth.completeSignup')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteGoogleSignup;
