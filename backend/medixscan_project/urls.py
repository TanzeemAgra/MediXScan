"""
URL configuration for medixscan_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from test_endpoint import test_endpoint
from health_check import health_check, simple_home
from simple_debug import simple_debug, ping, status

urlpatterns = [
    path('ping/', ping, name='ping'),  # Ultra-simple ping
    path('status/', status, name='status'),  # Status without DB
    path('simple/', simple_debug, name='simple_debug'),  # Environment check
    path('', simple_home, name='home'),  # Root endpoint
    path('health/', health_check, name='health'),  # Health check
    path('admin/', admin.site.urls),
    path('test/', test_endpoint, name='test'),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('accounts.rbac_urls')),  # RBAC management endpoints
    path('api/reports/', include('reports.urls')),
    path('api/', include('api.urls')),
    path('api/', include('patient_management.urls')),  # Added patient management URLs
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
