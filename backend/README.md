# MediXscan Backend (Django)

Django-based backend for MediXscan radiology report analysis system.

## Features

- **User Authentication**: Email-based authentication with JWT tokens
- **Report Analysis**: AI-powered radiology report error detection
- **RESTful API**: Clean API design with Django REST Framework
- **Database**: PostgreSQL with Django ORM
- **Admin Panel**: Built-in Django admin interface
- **Soft Configuration**: Environment-based configuration
- **Security**: CORS, CSRF protection, and secure defaults

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL
- OpenAI API Key

### Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your values:**
   ```bash
   # Database (use your PostgreSQL credentials)
   DB_NAME=radiology
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432

   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key

   # Django Security
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   # Windows
   .\startup.ps1
   
   # Linux/Mac
   ./startup.sh
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Reports
- `POST /api/reports/analyze/` - Analyze radiology report
- `GET /api/reports/history/` - Get user's report history
- `GET /api/reports/download/<id>/` - Download analyzed report
- `GET /api/reports/analytics/` - Get analytics data

### Health Check
- `GET /api/health/` - System health check
- `GET /api/version/` - API version info

## Database Models

### User Model
- Email-based authentication
- Report history tracking
- User profiles with metadata

### Report Analysis
- Original and analyzed text storage
- Error categorization and tracking
- Processing status and metadata
- File upload support

### Analytics
- Error type statistics
- Processing time metrics
- User activity tracking

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Admin Interface
1. Create superuser: `python manage.py createsuperuser`
2. Access admin: http://localhost:8000/admin/

## Deployment

### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Production Settings
- Set `DEBUG=False` in production
- Use strong `SECRET_KEY`
- Configure proper database credentials
- Set up SSL/HTTPS
- Configure static file serving

## Security Features

- Environment-based configuration (no hardcoded secrets)
- CORS protection for frontend integration
- Django's built-in CSRF protection
- Token-based authentication
- Secure password hashing
- SQL injection prevention via ORM

## API Documentation

When running in development mode, detailed API documentation is available at:
- Django Admin: http://localhost:8000/admin/
- API endpoints: http://localhost:8000/api/

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Verify database "radiology" exists
3. Check credentials in .env file
4. Test connection: `python manage.py check --database default`

### OpenAI API Issues
1. Verify API key in .env file
2. Check API quota and billing
3. Test connection: `python manage.py shell` and test API calls

### Migration Issues
1. Reset migrations: `python manage.py migrate --fake-initial`
2. Check database permissions
3. Verify model definitions
