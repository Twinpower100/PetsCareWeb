/**
 * API сервис для проверки уникальности полей
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export interface ValidationResponse {
  email?: string;
  phone?: string;
  exists: boolean;
  valid: boolean;
}

class ValidationAPI {
  /**
   * Проверяет уникальность email
   * @param email - email для проверки
   * @returns Promise с результатом проверки
   */
  async checkEmail(email: string): Promise<ValidationResponse> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const fullUrl = `${baseUrl}/api/api/check-email/?email=${encodeURIComponent(email)}`;
    console.log('ValidationAPI: API_BASE_URL =', API_BASE_URL);
    console.log('ValidationAPI: baseUrl =', baseUrl);
    console.log('ValidationAPI: fullUrl =', fullUrl);
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  /**
   * Проверяет уникальность номера телефона
   * @param phone - номер телефона для проверки
   * @returns Promise с результатом проверки
   */
  async checkPhone(phone: string): Promise<ValidationResponse> {
    // Убираем /api из API_BASE_URL если он есть
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
    const fullUrl = `${baseUrl}/api/api/check-phone/?phone=${encodeURIComponent(phone)}`;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

export const validationAPI = new ValidationAPI();
