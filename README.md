# Todo Application (Full Stack)

Полнофункциональное Todo приложение с Django REST API backend и React TypeScript frontend.

## Технологии

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django Simple JWT 5.3.0
- PostgreSQL 15
- Docker & Docker Compose

### Frontend
- React 18+ с TypeScript
- Vite для сборки
- React Router v6
- TanStack Query (React Query)
- React Hook Form
- Tailwind CSS
- Lucide React (иконки)

## Функциональность

### Аутентификация
- Регистрация пользователей
- Авторизация с JWT токенами
- Автоматическое обновление токенов
- Защищенные маршруты
- Logout с blacklist токенов

### Управление задачами
- CRUD операции с задачами
- Статусы: Pending, Done, Archived
- Дата создания и due date
- Отметка просроченных задач
- Фильтрация по статусу, дате, поиск
- Пагинация
- Массовые операции
- Статистика задач

### UI/UX
- Адаптивный дизайн
- Современный интерфейс
- Loading состояния
- Уведомления (toast)
- Модальные окна
- Валидация форм

## Быстрый запуск

### Предварительные требования
- Docker
- Docker Compose

### Настройка переменных окружения

1. **Создайте .env файл в корне проекта:**
   ```bash
   cp .env.example .env
   ```

2. **Отредактируйте .env файл с вашими настройками:**
   ```bash
   # Database Configuration
   POSTGRES_DB=todo_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   
   # Backend Configuration
   SECRET_KEY=your-django-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1,backend
   
   # JWT Settings
   ACCESS_TOKEN_LIFETIME_MINUTES=60
   REFRESH_TOKEN_LIFETIME_DAYS=7
   
   # CORS Settings
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   
   # Frontend Configuration
   VITE_API_URL=http://localhost:8000/api
   ```

### Запуск проекта

1. **Клонируйте репозиторий**
   ```bash
   git clone <repository-url>
   cd test-task
   ```

2. **Настройте переменные окружения**
   ```bash
   cp .env.example .env
   # Отредактируйте .env файл с вашими настройками
   ```

3. **Запустите все сервисы**
   ```bash
   docker-compose up --build
   ```

4. **Откройте приложение**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Django Admin: http://localhost:8000/admin

### Тестовые данные

После запуска автоматически создается суперпользователь:
- **Username:** admin
- **Password:** admin123

## API Endpoints

### Аутентификация
```
POST /api/auth/register/     - Регистрация
POST /api/auth/login/        - Авторизация
POST /api/auth/logout/       - Выход
POST /api/auth/refresh/      - Обновление токена
GET  /api/auth/profile/      - Профиль пользователя
PUT  /api/auth/profile/      - Обновление профиля
POST /api/auth/change-password/ - Смена пароля
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

## Структура проекта

```
test-task/
├── backend/                 # Django REST API
│   ├── apps/
│   │   ├── users/          # Пользователи и аутентификация
│   │   └── tasks/          # Управление задачами
│   ├── todo_project/       # Настройки Django
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── entrypoint.sh
│   └── .env.example
├── frontend/               # React TypeScript App
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API сервисы
│   │   ├── context/        # React контексты
│   │   └── types/          # TypeScript типы
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker-compose.yml      # Оркестрация сервисов
├── .env.example           # Пример переменных окружения
└── README.md
```

## Переменные окружения

### Главный .env файл (корень проекта)
```bash
# Database Configuration
POSTGRES_DB=todo_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Backend Configuration
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Frontend Configuration
VITE_API_URL=http://localhost:8000/api
```

### backend/.env.example
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### frontend/.env.example
```bash
VITE_API_URL=http://localhost:8000/api
```

## Разработка

### Backend (локально)
```bash
cd backend
cp .env.example .env
# Отредактируйте .env
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (локально)
```bash
cd frontend
cp .env.example .env
# Отредактируйте .env
npm install
npm run dev
```

## Команды Docker

```bash
# Запуск всех сервисов
docker-compose up

# Запуск в фоне
docker-compose up -d

# Пересборка образов
docker-compose up --build

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs backend
docker-compose logs frontend

# Выполнение команд в контейнере
docker-compose exec backend python manage.py shell
docker-compose exec backend python manage.py migrate
```

## Безопасность

- Все sensitive данные хранятся в .env файлах
- .env файлы добавлены в .gitignore
- Для production используйте сильные пароли и секретные ключи
- Регулярно обновляйте зависимости

## Production Deployment

1. **Обновите переменные окружения для production**
2. **Установите DEBUG=False**
3. **Используйте сильные пароли и секретные ключи**
4. **Настройте SSL/HTTPS**
5. **Используйте production готовую БД**
6. **Настройте статические файлы**
7. **Добавьте мониторинг и логирование**

## Поддержка

Если возникли вопросы или проблемы, создайте issue в репозитории. 