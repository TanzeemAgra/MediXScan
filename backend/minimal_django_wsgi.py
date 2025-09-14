"""
Minimal Django WSGI configuration for debugging
"""
import os
import sys
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

# Minimal Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'minimal_django_settings')

# Configure Django with minimal settings
from django.conf import settings

if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY=os.getenv('SECRET_KEY', 'temporary-minimal-key-for-testing'),
        ALLOWED_HOSTS=['*'],
        ROOT_URLCONF='minimal_django_wsgi',
        USE_TZ=True,
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
        ],
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',  # In-memory SQLite for testing
            }
        },
        MIDDLEWARE=[
            'django.middleware.security.SecurityMiddleware',
            'django.middleware.common.CommonMiddleware',
        ],
    )

# Import Django components after configuration
from django.urls import path
from django.http import JsonResponse, HttpResponse
from django.core.wsgi import get_wsgi_application

def minimal_django_ping(request):
    return HttpResponse("MINIMAL DJANGO IS WORKING!")

def minimal_django_info(request):
    return JsonResponse({
        "status": "Django configured successfully",
        "debug": settings.DEBUG,
        "database_engine": settings.DATABASES['default']['ENGINE'],
        "installed_apps": list(settings.INSTALLED_APPS),
        "request_method": request.method,
        "path": request.path,
        "host": request.get_host(),
    })

# URL configuration
urlpatterns = [
    path('django-ping/', minimal_django_ping, name='django_ping'),
    path('django-info/', minimal_django_info, name='django_info'),
    path('', minimal_django_ping, name='home'),
]

# WSGI application
application = get_wsgi_application()