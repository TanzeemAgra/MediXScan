from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from functools import wraps
from .models import AuditLog


class BaseRBACPermission(permissions.BasePermission):
    """
    Base permission class for RBAC system
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class IsSuperUser(BaseRBACPermission):
    """
    Permission class to check if user has SuperUser role
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.is_superuser_role()


class IsDoctor(BaseRBACPermission):
    """
    Permission class to check if user has Doctor role
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.is_doctor_role()


class HasPermission(BaseRBACPermission):
    """
    Permission class to check if user has specific permission
    """
    def __init__(self, permission_codename):
        self.permission_codename = permission_codename
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.has_permission(self.permission_codename)


class HasAnyPermission(BaseRBACPermission):
    """
    Permission class to check if user has any of the specified permissions
    """
    def __init__(self, permission_codenames):
        self.permission_codenames = permission_codenames
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return any(request.user.has_permission(perm) for perm in self.permission_codenames)


class HasRole(BaseRBACPermission):
    """
    Permission class to check if user has specific role
    """
    def __init__(self, role_name):
        self.role_name = role_name
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.has_role(self.role_name)


class HasAnyRole(BaseRBACPermission):
    """
    Permission class to check if user has any of the specified roles
    """
    def __init__(self, role_names):
        self.role_names = role_names
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return any(request.user.has_role(role) for role in self.role_names)


class CanManageUsers(BaseRBACPermission):
    """
    Permission class to check if user can manage other users
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.can_manage_users()


# Decorator functions for view-level permission checking
def require_permission(permission_codename):
    """
    Decorator to require specific permission for a view function
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            if not request.user.has_permission(permission_codename):
                # Log unauthorized access attempt
                AuditLog.objects.create(
                    user=request.user,
                    action='PERMISSION_DENIED',
                    resource_type='API_ENDPOINT',
                    details={
                        'required_permission': permission_codename,
                        'endpoint': request.path,
                        'method': request.method
                    },
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                raise PermissionDenied(f"Permission '{permission_codename}' required")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_role(role_name):
    """
    Decorator to require specific role for a view function
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            if not request.user.has_role(role_name):
                # Log unauthorized access attempt
                AuditLog.objects.create(
                    user=request.user,
                    action='ROLE_DENIED',
                    resource_type='API_ENDPOINT',
                    details={
                        'required_role': role_name,
                        'endpoint': request.path,
                        'method': request.method
                    },
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                raise PermissionDenied(f"Role '{role_name}' required")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_superuser(view_func):
    """
    Decorator to require SuperUser role
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authentication required")
        
        if not request.user.is_superuser_role():
            # Log unauthorized access attempt
            AuditLog.objects.create(
                user=request.user,
                action='SUPERUSER_REQUIRED',
                resource_type='API_ENDPOINT',
                details={
                    'endpoint': request.path,
                    'method': request.method
                },
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            raise PermissionDenied("SuperUser access required")
        
        return view_func(request, *args, **kwargs)
    return wrapper


def get_client_ip(request):
    """
    Get client IP address from request
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


# Permission checking utilities
class PermissionChecker:
    """
    Utility class for checking permissions in business logic
    """
    
    @staticmethod
    def check_permission(user, permission_codename, raise_exception=True):
        """
        Check if user has specific permission
        """
        has_perm = user.has_permission(permission_codename)
        if not has_perm and raise_exception:
            raise PermissionDenied(f"Permission '{permission_codename}' required")
        return has_perm
    
    @staticmethod
    def check_role(user, role_name, raise_exception=True):
        """
        Check if user has specific role
        """
        has_role = user.has_role(role_name)
        if not has_role and raise_exception:
            raise PermissionDenied(f"Role '{role_name}' required")
        return has_role
    
    @staticmethod
    def check_superuser(user, raise_exception=True):
        """
        Check if user is SuperUser
        """
        is_super = user.is_superuser_role()
        if not is_super and raise_exception:
            raise PermissionDenied("SuperUser access required")
        return is_super
    
    @staticmethod
    def can_access_resource(user, resource_type, action):
        """
        Check if user can perform action on resource type
        """
        permission_map = {
            'scan': {
                'upload': 'upload_scan',
                'view': 'view_scan',
                'delete': 'delete_scan',
                'approve': 'approve_scan'
            },
            'report': {
                'create': 'create_report',
                'view': 'view_report',
                'edit': 'edit_report',
                'delete': 'delete_report',
                'approve': 'approve_report'
            },
            'user': {
                'create': 'create_user',
                'view': 'view_user',
                'edit': 'edit_user',
                'delete': 'delete_user',
                'manage': 'manage_users'
            },
            'patient': {
                'create': 'create_patient',
                'view': 'view_patient',
                'edit': 'edit_patient',
                'delete': 'delete_patient'
            }
        }
        
        required_permission = permission_map.get(resource_type, {}).get(action)
        if not required_permission:
            return False
        
        return user.has_permission(required_permission)


# Middleware for RBAC auditing
class RBACMiddleware:
    """
    Middleware to log user actions for RBAC auditing
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log API access if user is authenticated
        if request.user.is_authenticated and request.path.startswith('/api/'):
            AuditLog.objects.create(
                user=request.user,
                action='API_ACCESS',
                resource_type='API_ENDPOINT',
                details={
                    'endpoint': request.path,
                    'method': request.method,
                    'status_code': response.status_code
                },
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
        
        return response
