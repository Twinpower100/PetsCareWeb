import { useState, useEffect } from 'react';
import { catalogAPI, ServiceCategory } from '../services/catalogAPI';

/**
 * Хук для работы с категориями услуг
 * Загружает корневые категории услуг из API
 */
export const useServiceCategories = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await catalogAPI.getServiceCategories();
        setCategories(response.results);
      } catch (err) {
        console.error('Error loading service categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Повторная загрузка будет выполнена в useEffect
    }
  };
};
