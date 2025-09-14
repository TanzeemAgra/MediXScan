#!/bin/bash

# Railway deployment setup script
echo "🚀 Starting Railway deployment setup..."

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "🗃️ Running database migrations..."
python manage.py migrate

# Check if database is working
echo "✅ Checking database connection..."
python manage.py check --database default

echo "🎉 Deployment setup complete!"