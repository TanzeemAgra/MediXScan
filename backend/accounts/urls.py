from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .simple_views import simple_login
from .emergency_login import emergency_login

# Create router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserManagementViewSet, basename='user')
router.register(r'roles', views.RoleViewSet, basename='role')
router.register(r'permissions', views.PermissionViewSet, basename='permission')
router.register(r'audit-logs', views.AuditLogViewSet, basename='audit-log')

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('simple-login/', simple_login, name='simple-login'),
    path('emergency-login/', emergency_login, name='emergency-login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile management
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # Dashboard
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # RBAC specific endpoints (SuperUser only)
    path('create-doctor/', views.UserManagementViewSet.as_view({'post': 'create_doctor'}), name='create-doctor'),
    path('assign-role/', views.UserManagementViewSet.as_view({'post': 'assign_role'}), name='assign-role'),
    path('assign-permission/', views.UserManagementViewSet.as_view({'post': 'assign_permission'}), name='assign-permission'),
    
    # Doctor specific endpoints
    path('upload-scan/', views.upload_scan, name='upload-scan'),
    path('view-report/', views.view_report, name='view-report'),
    
    # Include router URLs
    path('', include(router.urls)),
]
