"""
Simplified URL configuration for testing
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse, HttpResponse

def simple_home(request):
    return JsonResponse({
        "message": "MediXScan Backend is working!",
        "status": "success",
        "endpoints": {
            "admin": "/admin/",
            "health": "/health/"
        }
    })

def health_check(request):
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return JsonResponse({
        "status": "ok",
        "database": db_status,
        "message": "Health check passed"
    })

urlpatterns = [
    path('', simple_home, name='home'),
    path('health/', health_check, name='health'),
    path('admin/', admin.site.urls),
]