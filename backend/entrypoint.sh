#!/bin/bash

# Функция для проверки подключения к базе данных
wait_for_db() {
    echo "Waiting for PostgreSQL database..."
    while ! nc -z $DB_HOST $DB_PORT; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 1
    done
    echo "PostgreSQL is up - continuing..."
}

# Проверка соединения с базой данных
wait_for_db

# Дополнительная пауза для полной готовности PostgreSQL
sleep 2

# Создание директорий для логов
mkdir -p /app/logs

# Проверка и создание миграций
echo "Making migrations..."
python manage.py makemigrations users
python manage.py makemigrations tasks

# Применение миграций
echo "Applying database migrations..."
python manage.py migrate

# Сбор статических файлов
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Создание суперпользователя если он не существует
echo "Creating superuser..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
EOF

# Загрузка тестовых данных (опционально)
echo "Loading fixtures (if any)..."
if [ -f "fixtures/initial_data.json" ]; then
    python manage.py loaddata fixtures/initial_data.json
    echo "Test data loaded"
else
    echo "No test data found - skipping"
fi

echo "Starting Django development server..."
exec python manage.py runserver 0.0.0.0:8000 