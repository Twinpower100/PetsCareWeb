/**
 * API сервис для аутентификации
 * Обеспечивает взаимодействие с Django API для входа, регистрации и Google OAuth
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
  needs_phone?: boolean;
}

export interface GoogleAuthRequest {
  token: string;
}

/**
 * API сервис для аутентификации
 */
class AuthAPI {
  /**
   * Выполняет вход пользователя
   * @param credentials - данные для входа
   * @returns Promise с токенами и данными пользователя
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Регистрирует нового пользователя
   * @param userData - данные пользователя
   * @returns Promise с токенами и данными пользователя
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    console.log('AuthAPI: Sending registration request:', userData);
    
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('AuthAPI: Response status:', response.status);
    console.log('AuthAPI: Response headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AuthAPI: Registration error:', errorData);
      console.error('AuthAPI: Full error details:', JSON.stringify(errorData, null, 2));
      
      // Обрабатываем ошибки валидации полей
      if (errorData.phone_number && Array.isArray(errorData.phone_number)) {
        throw new Error(`phone_number: ${errorData.phone_number[0]}`);
      }
      if (errorData.email && Array.isArray(errorData.email)) {
        throw new Error(`email: ${errorData.email[0]}`);
      }
      if (errorData.first_name && Array.isArray(errorData.first_name)) {
        throw new Error(`first_name: ${errorData.first_name[0]}`);
      }
      if (errorData.last_name && Array.isArray(errorData.last_name)) {
        throw new Error(`last_name: ${errorData.last_name[0]}`);
      }
      
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('AuthAPI: Successful registration:', result);
    return result;
  }

  /**
   * Выполняет аутентификацию через Google OAuth
   * @param googleToken - токен от Google
   * @returns Promise с токенами и данными пользователя
   */
  async googleAuth(googleToken: string): Promise<AuthResponse> {
    console.log('AuthAPI: Sending Google auth request with token:', googleToken.substring(0, 20) + '...');
    
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/api/google-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleToken }),
    });

    console.log('AuthAPI: Google auth response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AuthAPI: Google auth error:', errorData);
      console.error('AuthAPI: Full error response:', errorData);
      throw new Error(errorData.detail || errorData.non_field_errors?.[0] || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Обновляет токен доступа
   * @param refreshToken - refresh токен
   * @returns Promise с новым access токеном
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Выход пользователя (отзыв токена)
   * @param refreshToken - refresh токен для отзыва
   */
  async logout(refreshToken: string): Promise<void> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    await fetch(`${baseUrl}/api/api/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  /**
   * Обновляет профиль пользователя
   * @param accessToken - access токен
   * @param userData - данные для обновления
   * @returns Promise с обновленными данными пользователя
   */
  async updateProfile(accessToken: string, userData: any): Promise<any> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/api/profile/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('AuthAPI: Profile update error response:', errorData);
      
      // Обрабатываем ошибки валидации Django
      if (errorData.phone_number) {
        throw new Error(`phone_number: ${Array.isArray(errorData.phone_number) ? errorData.phone_number[0] : errorData.phone_number}`);
      }
      
      // Обрабатываем общие ошибки
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      
      // Обрабатываем non_field_errors
      if (errorData.non_field_errors) {
        throw new Error(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Получает данные текущего пользователя
   * @param accessToken - access токен
   * @returns Promise с данными пользователя
   */
  async getCurrentUser(accessToken: string): Promise<any> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const url = `${baseUrl}/api/api/profile/`;
    console.log('AuthAPI: Getting current user from URL:', url);
    console.log('AuthAPI: Using access token:', accessToken);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('AuthAPI: getCurrentUser response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Запрос восстановления пароля
   */
  async forgotPassword(email: string): Promise<{ message: string; success: boolean }> {
    console.log('AuthAPI: Sending forgot password request for:', email);
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/forgot-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AuthAPI: Forgot password error:', errorData);
      throw new Error(errorData.message || 'Failed to send password reset email');
    }

    return response.json();
  }

  /**
   * Сброс пароля по токену
   */
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ message: string; success: boolean }> {
    console.log('AuthAPI: Sending reset password request');
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token, 
        new_password: newPassword, 
        confirm_password: confirmPassword 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AuthAPI: Reset password error:', errorData);
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return response.json();
  }
}

// Экспортируем единственный экземпляр
export const authAPI = new AuthAPI();
export default authAPI;
