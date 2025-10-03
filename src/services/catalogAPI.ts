/**
 * API сервис для работы с каталогом услуг
 * Предоставляет методы для получения данных о услугах и категориях
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface ServiceCategory {
  id: number;
  code: string;
  name: string;
  name_en: string;
  name_ru: string;
  name_me: string;
  name_de: string;
  description: string;
  description_en: string;
  description_ru: string;
  description_me: string;
  description_de: string;
  icon: string;
  level: number;
  hierarchy_order: string;
  is_active: boolean;
  parent: number | null;
}

export interface ServiceCategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceCategory[];
}

class CatalogAPI {
  /**
   * Получает корневые категории услуг (уровень 0)
   * Публичный API - не требует аутентификации
   */
  async getServiceCategories(): Promise<ServiceCategoriesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/public/service-categories/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching service categories:', error);
      throw error;
    }
  }

  /**
   * Получает локализованное название категории
   * @param category Категория услуги
   * @param language Код языка (en, ru, me, de)
   */
  getLocalizedName(category: ServiceCategory, language: string): string {
    switch (language) {
      case 'en':
        return category.name_en || category.name;
      case 'ru':
        return category.name_ru || category.name;
      case 'me':
        return category.name_me || category.name;
      case 'de':
        return category.name_de || category.name;
      default:
        return category.name;
    }
  }

  /**
   * Получает локализованное описание категории
   * @param category Категория услуги
   * @param language Код языка (en, ru, me, de)
   */
  getLocalizedDescription(category: ServiceCategory, language: string): string {
    switch (language) {
      case 'en':
        return category.description_en || category.description;
      case 'ru':
        return category.description_ru || category.description;
      case 'me':
        return category.description_me || category.description;
      case 'de':
        return category.description_de || category.description;
      default:
        return category.description;
    }
  }
}

export const catalogAPI = new CatalogAPI();
export default catalogAPI;
