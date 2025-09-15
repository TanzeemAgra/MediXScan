#!/bin/bash
# Railway Deployment Script
# =========================
# This script handles the complete Railway deployment process
# It's referenced in railway.toml startCommand

set -e  # Exit on any error

echo "🚀 Starting Railway Deployment Process..."

# 1. Create necessary directories
echo "📁 Creating directories..."
mkdir -p staticfiles
mkdir -p media
mkdir -p logs

# 2. Install dependencies (if requirements changed)
echo "📦 Installing dependencies..."
pip install --no-cache-dir -r requirements.txt

# 3. Collect static files first
echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput --clear

# 4. Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

# 5. Create superuser if needed (Railway environment)
echo "👤 Setting up super admin..."
python setup_railway_admin.py || echo "Super admin setup completed or already exists"

# 6. Validate deployment
echo "✅ Validating deployment..."
python manage.py check --deploy

# 7. Start the application server
echo "🌐 Starting Gunicorn server..."
exec gunicorn medixscan_project.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --worker-class sync \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --log-level info \
    --access-logfile - \
    --error-logfile -