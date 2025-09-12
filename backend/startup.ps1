# MediXscan Backend Local Development Script
Write-Host "Starting MediXscan Backend (Local Development)..." -ForegroundColor Green

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.example to .env and configure your settings." -ForegroundColor Yellow
    exit 1
}

# Wait for database to be ready
Write-Host "Checking database connection..." -ForegroundColor Yellow
python manage.py check --database default

if ($LASTEXITCODE -eq 0) {
    # Run migrations
    Write-Host "Applying database migrations..." -ForegroundColor Yellow
    python manage.py migrate

    # Collect static files
    Write-Host "Collecting static files..." -ForegroundColor Yellow
    python manage.py collectstatic --noinput

    # Create superuser if needed (development only)
    Write-Host "Checking for admin user..." -ForegroundColor Yellow
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@medixscan.com').exists():
    User.objects.create_superuser('admin', 'admin@medixscan.com', 'admin123')
    print('Admin user created: admin@medixscan.com / admin123')
else:
    print('Admin user already exists')
"

    # Start the development server
    Write-Host ""
    Write-Host "🚀 Starting Django development server..." -ForegroundColor Green
    Write-Host "📍 Frontend: http://localhost:8000/" -ForegroundColor Cyan
    Write-Host "📍 API: http://localhost:8000/api/" -ForegroundColor Cyan  
    Write-Host "📍 Admin: http://localhost:8000/admin/" -ForegroundColor Cyan
    Write-Host "🔑 Admin Login: admin@medixscan.com / admin123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    python manage.py runserver 0.0.0.0:8000
} else {
    Write-Host "❌ Database connection failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Check your .env file configuration" -ForegroundColor White
    Write-Host "2. Ensure PostgreSQL is running" -ForegroundColor White
    Write-Host "3. Verify the 'radiology' database exists" -ForegroundColor White
    Write-Host "4. Test connection: python manage.py dbshell" -ForegroundColor White
}
