"""
Ultra-minimal Django WSGI application for debugging
"""
import os
import sys
from django.conf import settings
from django.urls import path
from django.http import JsonResponse, HttpResponse
from django.core.wsgi import get_wsgi_application

# Minimal Django settings
if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY='temporary-debug-key-for-testing',
        ALLOWED_HOSTS=['*'],
        ROOT_URLCONF='debug_wsgi',
        USE_TZ=True,
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
        ],
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',
            }
        }
    )

def debug_ping(request):
    return HttpResponse("MINIMAL DJANGO IS WORKING!")

def debug_info(request):
    return JsonResponse({
        "status": "working",
        "python_version": sys.version,
        "django_version": getattr(settings, 'VERSION', 'unknown'),
        "request_method": request.method,
        "path": request.path,
        "host": request.get_host(),
    })

urlpatterns = [
    path('minimal-ping/', debug_ping, name='minimal_ping'),
    path('minimal-info/', debug_info, name='minimal_info'),
]

application = get_wsgi_application()