"""
Simple debug views that don't depend on database or complex imports
"""

from django.http import JsonResponse, HttpResponse
import sys
import os

def simple_debug(request):
    """Ultra-simple debug endpoint"""
    return JsonResponse({
        "message": "Django is responding!",
        "python_version": sys.version,
        "django_working": True,
        "environment_vars": {
            "DATABASE_URL": "SET" if os.getenv('DATABASE_URL') else "NOT SET",
            "DEBUG": os.getenv('DEBUG', 'NOT SET'),
            "SECRET_KEY": "SET" if os.getenv('SECRET_KEY') else "NOT SET",
            "RAILWAY_ENVIRONMENT": os.getenv('RAILWAY_ENVIRONMENT', 'NOT SET')
        }
    })

def ping(request):
    """Simple ping endpoint"""
    return HttpResponse("PONG - Django is alive!")

def status(request):
    """Status check without database"""
    try:
        from django.conf import settings
        debug_mode = getattr(settings, 'DEBUG', False)
        allowed_hosts = getattr(settings, 'ALLOWED_HOSTS', [])
    except Exception as e:
        debug_mode = f"Error: {e}"
        allowed_hosts = f"Error: {e}"
    
    return JsonResponse({
        "status": "ok",
        "debug": debug_mode,
        "allowed_hosts": allowed_hosts,
        "request_host": request.get_host(),
        "request_path": request.path
    })