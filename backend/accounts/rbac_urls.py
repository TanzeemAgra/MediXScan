# RBAC User Management URL Configuration
# Advanced routing for super admin user management system

from django.urls import path, include
from . import rbac_views

# RBAC Management URLs (Super Admin Only)
rbac_patterns = [
    # Dashboard and Statistics
    path('dashboard/stats/', rbac_views.rbac_dashboard_stats, name='rbac_dashboard_stats'),
    
    # User Management
    path('users/', rbac_views.rbac_users_management, name='rbac_users_list'),
    path('users/bulk/', rbac_views.rbac_users_management, name='rbac_users_bulk'),
    
    # Role Management
    path('roles/', rbac_views.rbac_roles_management, name='rbac_roles_list'),
    path('roles/<uuid:role_id>/', rbac_views.rbac_roles_management, name='rbac_role_detail'),
    
    # Activity Monitoring
    path('activity-logs/', rbac_views.rbac_activity_logs, name='rbac_activity_logs'),
    path('security-monitoring/', rbac_views.rbac_security_monitoring, name='rbac_security_monitoring'),
    
    # Registration Notifications (Super Admin Only)
    path('notifications/registrations/', rbac_views.rbac_registration_notifications, name='rbac_registration_notifications'),
    path('notifications/registrations/<uuid:notification_id>/approve/', rbac_views.rbac_approve_registration, name='rbac_approve_registration'),
    path('notifications/registrations/<uuid:notification_id>/reject/', rbac_views.rbac_reject_registration, name='rbac_reject_registration'),
    path('notifications/registrations/<uuid:notification_id>/', rbac_views.rbac_delete_notification, name='rbac_delete_notification'),
    path('notifications/stats/', rbac_views.rbac_notification_stats, name='rbac_notification_stats'),
]

urlpatterns = [
    # RBAC Management endpoints (prefix: /api/rbac/)
    path('rbac/', include(rbac_patterns)),
]
