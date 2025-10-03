/**
 * Сервис для Google OAuth аутентификации
 * Использует Google Identity Services (GSI) для получения токенов
 */

// Типы для Google OAuth
declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

class GoogleAuthService {
  private clientId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '264399838494-ma8a5di2kup601ukefj372n0rc1c28k6.apps.googleusercontent.com';
    console.log('GoogleAuthService: Client ID loaded:', this.clientId ? 'Yes' : 'No');
    console.log('GoogleAuthService: Full env:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('GoogleAuthService: Using client_id:', this.clientId);
  }

  /**
   * Инициализирует Google OAuth SDK
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Проверяем, что Google SDK загружен
      if (typeof window.google === 'undefined') {
        reject(new Error('Google SDK not loaded'));
        return;
      }

      try {
        if (!this.clientId) {
          reject(new Error('Google Client ID not configured. Please check REACT_APP_GOOGLE_CLIENT_ID in .env file'));
          return;
        }

        console.log('GoogleAuthService: Initializing with client_id:', this.clientId);
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response: GoogleCredentialResponse) => {
            // Обработчик будет установлен при вызове renderButton
            console.log('Google OAuth callback triggered');
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Отключаем FedCM
        });

        this.isInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Рендерит кнопку Google Sign-In в указанный элемент
   */
  async renderButton(
    elementId: string, 
    callback: (response: GoogleCredentialResponse) => void
  ): Promise<void> {
    await this.initialize();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    try {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
      });

      // Устанавливаем обработчик callback
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Отключаем FedCM
      });
    } catch (error) {
      console.error('Error rendering Google button:', error);
      throw error;
    }
  }

  /**
   * Показывает всплывающее окно Google Sign-In
   */
  async showPopup(callback: (response: GoogleCredentialResponse) => void): Promise<void> {
    await this.initialize();

    try {
      // Используем OAuth 2.0 для веб-приложений
      const authClient = window.google.accounts.oauth2.initCodeClient({
        client_id: this.clientId,
        scope: 'openid email profile',
        callback: (response: any) => {
          // Конвертируем OAuth response в credential response
          const credentialResponse: GoogleCredentialResponse = {
            credential: response.code,
            select_by: 'user'
          };
          callback(credentialResponse);
        }
      });

      // Запускаем OAuth flow
      authClient.requestCode();
    } catch (error) {
      console.error('Error showing Google popup:', error);
      throw error;
    }
  }

  /**
   * Получает authorization code из credential response
   */
  getJwtToken(response: GoogleCredentialResponse): string {
    return response.credential; // Это authorization code от Google OAuth 2.0
  }

  /**
   * Декодирует JWT токен (только для отладки)
   */
  decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
}

// Экспортируем singleton instance
export const googleAuthService = new GoogleAuthService();
