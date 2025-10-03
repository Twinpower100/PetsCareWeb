# PetCare Web Application

Веб-приложение для системы управления ветеринарными услугами PetCare, построенное на React с поддержкой мультиязычности.

## Особенности

- ✅ **Мультиязычность**: Поддержка 4 языков (английский, русский, черногорский, немецкий)
- ✅ **Современный UI**: Использование Tailwind CSS для стилизации
- ✅ **Маршрутизация**: React Router для навигации между страницами
- ✅ **Адаптивный дизайн**: Оптимизирован для всех устройств
- ✅ **TypeScript**: Полная типизация для надежности кода

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Header.tsx      # Заголовок с навигацией
│   ├── Footer.tsx      # Подвал сайта
│   └── LanguageSwitcher.tsx  # Переключатель языков
├── pages/              # Страницы приложения
│   ├── HomePage.tsx    # Главная страница
│   ├── ServicesPage.tsx # Страница услуг
│   ├── AboutPage.tsx   # Страница "О нас"
│   └── ContactPage.tsx # Страница контактов
├── i18n/               # Система мультиязычности
│   ├── index.ts        # Конфигурация i18n
│   └── locales/        # Файлы переводов
│       ├── en.json     # Английские переводы
│       └── ru.json     # Русские переводы
└── App.tsx             # Главный компонент приложения
```

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите приложение в режиме разработки:
```bash
npm start
```

3. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Доступные страницы

- `/` - Главная страница с обзором сервиса
- `/services` - Страница с описанием услуг
- `/about` - Информация о компании
- `/contact` - Контактная информация и форма обратной связи

## Мультиязычность

Приложение поддерживает 4 языка, соответствующих настройкам Django бэкенда:
- **Английский** (en) - по умолчанию
- **Русский** (ru)
- **Черногорский** (me)
- **Немецкий** (de)

Переключение языка доступно через выпадающий список в правом верхнем углу. Выбранный язык сохраняется в localStorage браузера.

## Технологии

- **React 19** - Основной фреймворк
- **TypeScript** - Типизация
- **React Router** - Маршрутизация
- **react-i18next** - Мультиязычность
- **Tailwind CSS** - Стилизация
- **React Testing Library** - Тестирование

## Соответствие требованиям

✅ **Мультиязычность**: Все пользовательские сообщения обернуты в функцию `t()` для переводов  
✅ **Английский язык**: Весь код и комментарии на английском языке  
✅ **Русские комментарии**: Все комментарии и документация на русском языке  
✅ **Структура**: Четкое разделение на компоненты и страницы  
✅ **Адаптивность**: Интерфейс работает на всех устройствах  

## API Integration

The frontend integrates with Django REST API for dynamic content:

### Services
- Services are loaded dynamically from Django catalog API
- Supports hierarchical service structure (categories and services)
- Multi-language support for service names and descriptions
- Real-time loading with error handling

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Django API Base URL
REACT_APP_API_URL=http://localhost:8000/api

# Development settings
REACT_APP_DEBUG=true
REACT_APP_ENVIRONMENT=development
```

### API Endpoints Used

- `GET /api/public/service-categories/` - Get root service categories (public, no auth required)
- `GET /api/catalog/services/` - Get all services (requires authentication)
- `GET /api/catalog/services/for_pet_type/?pet_type_id={id}` - Get services for specific pet type
- `GET /api/catalog/services/search/?q={query}` - Search services

## Следующие шаги

1. ✅ Интеграция с Django REST API (частично)
2. Добавление аутентификации пользователей
3. Реализация функционала бронирования
4. Добавление панели управления для администраторов
5. Мобильная версия приложения

## Разработка

Для разработки рекомендуется:
- Использовать ESLint и Prettier для форматирования кода
- Следовать принципам чистого кода
- Добавлять комментарии на русском языке
- Тестировать мультиязычность на всех страницах