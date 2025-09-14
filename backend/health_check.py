"""
Simple Django health check to verify app is working
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def health_check(request):
    """Simple health check endpoint"""
    try:
        from django.db import connection
        
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return JsonResponse({
        "status": "ok",
        "database": db_status,
        "message": "MediXScan Backend is running"
    })

def simple_home(request):
    """Simple home page for testing"""
    return JsonResponse({
        "message": "Welcome to MediXScan API",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "health": "/health/"
        }
    })