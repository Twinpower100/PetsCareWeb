import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/authAPI';

// Интерфейс для пользователя
interface User {
  id: number;
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

// Интерфейс для контекста аутентификации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<{ needsCompletion: boolean }>;
  googleSignup: (googleToken: string) => Promise<{ needsCompletion: boolean }>;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста аутентификации
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login with email:', email);
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: Login response received:', response);
      console.log('AuthContext: Access token:', response.access);
      
      // Сохраняем токены
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Проверяем, есть ли данные пользователя в ответе на вход
      if (response.user) {
        console.log('AuthContext: Using user data from login response:', response.user);
        setUser(response.user);
      } else {
        // Если данных пользователя нет в ответе, получаем их отдельно
        console.log('AuthContext: Fetching user data with token:', response.access);
        const userData = await authAPI.getCurrentUser(response.access);
        console.log('AuthContext: User data received:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  // Функция регистрации
  const signup = async (userData: any) => {
    try {
      const response = await authAPI.signup(userData);
      console.log('AuthContext: Signup response:', response);
      
      // Проверяем, есть ли токены в ответе
      if (response.access && response.refresh) {
        // Если есть токены, сохраняем их
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Получаем данные пользователя
        const userDataResponse = await authAPI.getCurrentUser(response.access);
        setUser(userDataResponse);
      } else {
        // Если токенов нет, автоматически входим в систему
        console.log('AuthContext: No tokens in signup response, attempting login...');
        await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Функция входа через Google
  const googleLogin = async (googleToken: string) => {
    try {
      console.log('AuthContext: Attempting Google login with token:', googleToken);
      const response = await authAPI.googleAuth(googleToken);
      console.log('AuthContext: Google login response received:', response);
      
      // Сохраняем токены
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Устанавливаем пользователя
      setUser(response.user);
      
      // Используем needs_phone из ответа сервера
      return { needsCompletion: response.needs_phone || false };
    } catch (error) {
      console.error('AuthContext: Google login failed:', error);
      throw error;
    }
  };

  // Функция регистрации через Google
  const googleSignup = async (googleToken: string) => {
    try {
      console.log('AuthContext: Attempting Google signup with token:', googleToken);
      const response = await authAPI.googleAuth(googleToken);
      console.log('AuthContext: Google signup response received:', response);
      
      // Сохраняем токены
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Устанавливаем пользователя
      setUser(response.user);
      
      // Используем needs_phone из ответа сервера
      return { needsCompletion: response.needs_phone || false };
    } catch (error) {
      console.error('AuthContext: Google signup failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    googleLogin,
    googleSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста аутентификации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
