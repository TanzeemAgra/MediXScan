from django.urls import path
from . import views
from .enhanced_rbac_api import EnhancedUserManagementAPI

app_name = 'api'

# Soft-coded URL patterns for Radiology API
urlpatterns = [
    # System endpoints
    path('test/', views.TestAPIView.as_view(), name='test'),
    path('health/', views.HealthCheckView.as_view(), name='health'),
    path('version/', views.VersionView.as_view(), name='version'),
    
    # Authentication endpoints (soft-coded)
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    
    # Data endpoints
    path('history/', views.HistoryView.as_view(), name='history'),
    
    # Enhanced RBAC User Management endpoints
    path('rbac/dashboard-stats/', EnhancedUserManagementAPI.get_dashboard_stats, name='rbac_dashboard_stats'),
    path('rbac/users/advanced/', EnhancedUserManagementAPI.get_users_advanced, name='rbac_users_advanced'),
    path('rbac/users/create-advanced/', EnhancedUserManagementAPI.create_advanced_user, name='rbac_create_advanced_user'),
    path('rbac/users/bulk-update/', EnhancedUserManagementAPI.bulk_update_users, name='rbac_bulk_update_users'),
    path('rbac/users/bulk-delete/', EnhancedUserManagementAPI.bulk_delete_users, name='rbac_bulk_delete_users'),
    path('rbac/system-metrics/', EnhancedUserManagementAPI.get_system_metrics, name='rbac_system_metrics'),
    path('rbac/online-users/', EnhancedUserManagementAPI.get_online_users, name='rbac_online_users'),
    path('rbac/security-events/', EnhancedUserManagementAPI.get_security_events, name='rbac_security_events'),
]
