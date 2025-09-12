#!/bin/bash

# MediXscan Backend Startup Script
echo "Starting MediXscan Backend..."

# Wait for database to be ready
echo "Waiting for database connection..."
python manage.py check --database default

# Run migrations
echo "Applying database migrations..."
python manage.py migrate

# Create superuser if it doesn't exist (for production)
echo "Checking for superuser..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    print("Creating admin user...")
    User.objects.create_superuser('admin', 'admin@medixscan.com', 'admin123')
    print("Admin user created successfully!")
else:
    print("Admin user already exists.")
EOF

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
