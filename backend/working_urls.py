"""
Working URL configuration
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "message": "Working Django is running!",
        "status": "success",
        "database": {
            "engine": "configured",
            "url_set": bool(request.META.get('DATABASE_URL'))
        }
    })

def simple_ping(request):
    return JsonResponse({"ping": "pong", "django": "working"})

urlpatterns = [
    path('', home, name='home'),
    path('ping/', simple_ping, name='ping'),
    path('admin/', admin.site.urls),
]