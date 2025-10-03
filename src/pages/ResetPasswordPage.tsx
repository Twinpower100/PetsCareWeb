import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/authAPI';

/**
 * Страница сброса пароля
 * 
 * Позволяет пользователю установить новый пароль используя токен восстановления.
 * Токен получается из URL параметров.
 */
const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  /**
   * Валидация пароля
   */
  const validatePassword = (password: string): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    
    if (password.length < 8) {
      errors.length = t('auth.passwordMinLength');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = t('auth.passwordUppercase');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = t('auth.passwordLowercase');
    }
    
    if (!/\d/.test(password)) {
      errors.digit = t('auth.passwordDigit');
    }
    
    return errors;
  };

  /**
   * Обработка отправки формы
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Валидация паролей
    const passwordErrors = validatePassword(newPassword);
    if (Object.keys(passwordErrors).length > 0) {
      setPasswordErrors(passwordErrors);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError(t('auth.invalidResetToken'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(token, newPassword, confirmPassword);
      setMessage(response.message);
      
      // Перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error instanceof Error ? error.message : t('auth.resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Обработка изменения пароля
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    // Валидация в реальном времени
    if (password.length > 0) {
      const errors = validatePassword(password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors({});
    }
    
    setError('');
  };

  /**
   * Обработка изменения подтверждения пароля
   */
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  /**
   * Проверка валидности токена при загрузке
   */
  useEffect(() => {
    if (!token) {
      setError(t('auth.invalidResetToken'));
    }
  }, [token, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.resetPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.resetPasswordDescription')}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {message ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('auth.passwordResetSuccess')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {message}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('auth.backToLogin')}
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    {t('auth.newPassword')} *
                  </label>
                  <div className="mt-1">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        Object.keys(passwordErrors).length > 0 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('auth.newPasswordPlaceholder')}
                    />
                  </div>
                  
                  {/* Отображение ошибок валидации пароля */}
                  {Object.keys(passwordErrors).length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      <ul className="list-disc list-inside space-y-1">
                        {Object.entries(passwordErrors).map(([key, error]) => (
                          <li key={key}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t('auth.confirmPassword')} *
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                    />
                  </div>
                  
                  {/* Отображение ошибки несовпадения паролей */}
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="mt-2 text-sm text-red-600">
                      {t('auth.passwordsDoNotMatch')}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword || Object.keys(passwordErrors).length > 0}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('common.loading') : t('auth.resetPassword')}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {t('auth.backToLogin')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
