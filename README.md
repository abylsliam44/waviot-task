# Todo App - Локальная версия

Полнофункциональное To-Do приложение с React фронтендом и Django бэкендом, готовое для локального запуска.

## Быстрый запуск

### Предварительные требования
- Docker
- Docker Compose

### 1. Клонирование репозитория
```bash
git clone https://github.com/abylsliam44/waviot-task.git
cd waviot-task
```

### 2. Создание .env файла
В корневой папке создайте файл `.env`:
```bash
# PostgreSQL Database
POSTGRES_DB=todo_db
POSTGRES_USER=todo_user
POSTGRES_PASSWORD=todo_password123

# Django Settings
SECRET_KEY=django-insecure-local-development-key-2024
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# Frontend API URL
VITE_API_URL=http://localhost:8000/api
```

### 3. Запуск приложения
```bash
docker-compose up -d
```

### 4. Доступ к приложению
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin (admin/admin123)

## Технологии

### Frontend
- React 18 + TypeScript
- Vite для сборки
- Tailwind CSS для стилизации
- React Router для навигации
- Axios для HTTP запросов
- React Query для управления состоянием
- React Hook Form для форм
- React Hot Toast для уведомлений

### Backend
- Django 4.2
- Django REST Framework
- JWT Authentication
- PostgreSQL 15
- Docker

## Функциональность

### Аутентификация
- Регистрация и авторизация пользователей
- JWT токены с автоматическим обновлением
- Защищенные маршруты
- Logout с blacklist токенов

### Управление задачами
- CRUD операции с задачами
- Статусы: Pending, Done, Archived
- Фильтрация по статусу, дате, поиск
- Пагинация результатов
- Массовые операции
- Статистика задач
- Отметка просроченных задач

### UI/UX
- Адаптивный дизайн
- Современный интерфейс
- Loading состояния
- Уведомления (toast)
- Модальные окна
- Валидация форм

## Разработка

### Остановка приложения
```bash
docker-compose down
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Пересборка контейнеров
```bash
docker-compose down
docker-compose up -d --build
```

### Выполнение команд в контейнере
```bash
# Django shell
docker-compose exec backend python manage.py shell

# Миграции
docker-compose exec backend python manage.py migrate

# Создание суперпользователя
docker-compose exec backend python manage.py createsuperuser
```

## Структура проекта

```
test-task/
├── frontend/          # React приложение
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API сервисы
│   │   ├── context/        # React контексты
│   │   └── types/          # TypeScript типы
│   ├── Dockerfile
│   └── package.json
├── backend/           # Django API
│   ├── apps/
│   │   ├── users/          # Пользователи и аутентификация
│   │   └── tasks/          # Управление задачами
│   ├── todo_project/       # Настройки Django
│   ├── Dockerfile
│   ├── requirements.txt
│   └── entrypoint.sh
├── docker-compose.yml # Docker конфигурация
├── .env              # Переменные окружения
└── README.md         # Документация
```

## Тестирование

1. Откройте http://localhost:3001
2. Зарегистрируйтесь с новым аккаунтом
3. Создайте несколько задач
4. Протестируйте все функции:
   - Создание, редактирование, удаление задач
   - Изменение статусов
   - Фильтрация и поиск
   - Массовые операции

## Устранение проблем

### Проблемы с базой данных
```bash
# Удалить volumes и пересоздать
docker-compose down -v
docker-compose up -d
```

### Проблемы с портами
Убедитесь, что порты свободны:
- 3001 (frontend)
- 8000 (backend)
- 5433 (postgres)

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER .
```

### Проверка статуса контейнеров
```bash
docker-compose ps
docker ps
```

## Безопасность

- Все sensitive данные хранятся в .env файлах
- .env файлы добавлены в .gitignore
- Для production используйте сильные пароли и секретные ключи
- JWT токены имеют ограниченное время жизни

## API Endpoints

### Аутентификация
```
POST /api/auth/register/     - Регистрация
POST /api/auth/login/        - Авторизация
POST /api/auth/logout/       - Выход
POST /api/auth/refresh/      - Обновление токена
GET  /api/auth/profile/      - Профиль пользователя
PUT  /api/auth/profile/      - Обновление профиля
```

### Задачи
```
GET    /api/tasks/           - Список задач
POST   /api/tasks/           - Создание задачи
GET    /api/tasks/{id}/      - Получение задачи
PUT    /api/tasks/{id}/      - Обновление задачи
DELETE /api/tasks/{id}/      - Удаление задачи
PATCH  /api/tasks/{id}/update_status/ - Обновление статуса
GET    /api/tasks/stats/     - Статистика
POST   /api/tasks/bulk_update_status/ - Массовое обновление
DELETE /api/tasks/bulk_delete/ - Массовое удаление
```

### Фильтры и параметры
```
?status=pending              - Фильтр по статусу
?search=текст               - Поиск по названию/описанию
?created_date=2024-01-01    - Фильтр по дате создания
?due_date=2024-01-01        - Фильтр по due date
?overdue=true               - Только просроченные
?ordering=-created_at       - Сортировка
?page=1                     - Пагинация
```
