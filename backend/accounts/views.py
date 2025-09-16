from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

from .models import User, Role, Permission, UserRole, UserPermission, RolePermission, AuditLog
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserListSerializer, UserDetailSerializer,
    UserCreateSerializer, UserUpdateSerializer, RoleSerializer, PermissionSerializer,
    AssignRoleSerializer, AssignPermissionSerializer, UserLoginSerializer,
    AuditLogSerializer, DashboardStatsSerializer
)
from .permissions import (
    IsSuperUser, IsDoctor, HasPermission, CanManageUsers,
    require_permission, require_role, require_superuser, get_client_ip
)

logger = logging.getLogger(__name__)
User = get_user_model()


# ===============================================
# AUTHENTICATION VIEWS
# ===============================================

class RegisterView(APIView):
    """User registration endpoint (public)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            # Log registration
            AuditLog.objects.create(
                user=user,
                action='REGISTER',
                resource_type='USER',
                resource_id=str(user.id),
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """Enhanced login endpoint with RBAC support and soft-coded authentication"""
    permission_classes = [AllowAny]
    
    def enhanced_user_lookup(self, email_or_username):
        """Soft-coded user lookup that tries multiple methods"""
        try:
            # Method 1: Direct email lookup
            user = User.objects.filter(email=email_or_username).first()
            if user:
                print(f"✅ Found user by email: {user.username}")
                return user
            
            # Method 2: Username lookup  
            user = User.objects.filter(username=email_or_username).first()
            if user:
                print(f"✅ Found user by username: {user.username}")
                return user
                
            # Method 3: Case-insensitive combined lookup
            from django.db.models import Q
            user = User.objects.filter(
                Q(email__iexact=email_or_username) | 
                Q(username__iexact=email_or_username)
            ).first()
            if user:
                print(f"✅ Found user by Q lookup: {user.username}")
                return user
                
            return None
        except Exception as e:
            print(f"❌ Error in user lookup: {e}")
            return None
    
    def enhanced_authentication(self, user, password):
        """Soft-coded authentication with multiple methods"""
        try:
            # Method 1: Standard Django authentication with username
            auth_user = authenticate(username=user.username, password=password)
            if auth_user:
                print(f"✅ Auth successful with username: {user.username}")
                return auth_user
            
            # Method 2: Authentication with email as username
            auth_user = authenticate(username=user.email, password=password)
            if auth_user:
                print(f"✅ Auth successful with email: {user.email}")
                return auth_user
            
            # Method 3: Direct password verification
            if user.check_password(password):
                print(f"✅ Direct password check successful")
                return user
                
            return None
        except Exception as e:
            print(f"❌ Error in authentication: {e}")
            return None
    
    def post(self, request):
        print("=== ENHANCED LOGIN VIEW CALLED ===")
        print(f"Request data: {request.data}")
        print(f"Request method: {request.method}")
        print(f"Request headers: {dict(request.headers)}")
        
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            print(f"Email: {email}")
            print(f"Password length: {len(password) if password else 0}")
            
            if not email or not password:
                print("Missing email or password")
                return Response({
                    'error': 'Email and password required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enhanced user lookup
            user_obj = self.enhanced_user_lookup(email)
            if not user_obj:
                print(f"User {email} does not exist")
                return Response({
                    'error': 'User not found',
                    'debug': 'ENHANCED_USER_LOOKUP_FAILED'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"User found: {user_obj.email}, active: {user_obj.is_active}")
            
            # Enhanced Authentication
            user = self.enhanced_authentication(user_obj, password)
            print(f"Enhanced authentication result: {user}")
            
            if user:
                if not user.is_active:
                    return Response({
                        'error': 'User account is disabled'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
                if hasattr(user, 'is_suspended') and user.is_suspended:
                    return Response({
                        'error': 'User account is suspended'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
                if hasattr(user, 'is_approved') and not user.is_approved:
                    return Response({
                        'error': 'User account is pending approval'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                token, created = Token.objects.get_or_create(user=user)
                print(f"Token created: {created}")
                
                # Update last login IP
                user.last_login_ip = get_client_ip(request)
                user.save(update_fields=['last_login_ip'])
                
                # Log login
                try:
                    AuditLog.objects.create(
                        user=user,
                        action='LOGIN',
                        resource_type='AUTH',
                        details={
                            'login_method': 'token',
                            'roles': [role.name for role in user.roles.filter(is_active=True)]
                        },
                        ip_address=get_client_ip(request),
                        user_agent=request.META.get('HTTP_USER_AGENT', '')
                    )
                except Exception as audit_error:
                    print(f"Audit log error: {audit_error}")
                
                response_data = {
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'full_name': getattr(user, 'full_name', ''),
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_superuser': user.is_superuser,
                        'is_staff': user.is_staff,
                        'is_active': user.is_active,
                    },
                    'message': 'Login successful'
                }
                print(f"Returning success response")
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                print("Enhanced authentication failed")
                return Response({
                    'error': 'Invalid email or password',
                    'debug': 'ENHANCED_AUTHENTICATION_FAILED'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print(f"Error in login: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Log logout
            AuditLog.objects.create(
                user=request.user,
                action='LOGOUT',
                resource_type='AUTH',
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Delete token
            token = Token.objects.get(user=request.user)
            token.delete()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({
                'message': 'User was not logged in'
            }, status=status.HTTP_400_BAD_REQUEST)


# ===============================================
# SUPERUSER ONLY VIEWS
# ===============================================

class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user management (SuperUser only)
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsSuperUser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserDetailSerializer
    
    def perform_create(self, serializer):
        user = serializer.save()
        
        # Log user creation
        AuditLog.objects.create(
            user=self.request.user,
            action='CREATE',
            resource_type='USER',
            resource_id=str(user.id),
            details={'created_user': user.email},
            ip_address=get_client_ip(self.request),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
    
    @action(detail=False, methods=['post'], url_path='create-doctor')
    def create_doctor(self, request):
        """
        Create a new doctor account (SuperUser only)
        """
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Ensure doctor role is assigned
            roles = serializer.validated_data.get('roles', [])
            if 'DOCTOR' not in roles:
                roles.append('DOCTOR')
            serializer.validated_data['roles'] = roles
            
            user = serializer.save()
            
            # Log doctor creation
            AuditLog.objects.create(
                user=request.user,
                action='CREATE',
                resource_type='DOCTOR',
                resource_id=str(user.id),
                details={'doctor_email': user.email},
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'user': UserDetailSerializer(user).data,
                'message': 'Doctor account created successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='assign-role')
    def assign_role(self, request):
        """
        Assign role to user (SuperUser only)
        """
        serializer = AssignRoleSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            role_name = serializer.validated_data['role_name']
            expires_at = serializer.validated_data.get('expires_at')
            
            try:
                user = User.objects.get(id=user_id)
                role = Role.objects.get(name=role_name)
                
                # Create or update user role
                user_role, created = UserRole.objects.get_or_create(
                    user=user,
                    role=role,
                    defaults={
                        'assigned_by': request.user,
                        'expires_at': expires_at
                    }
                )
                
                if not created:
                    user_role.assigned_by = request.user
                    user_role.expires_at = expires_at
                    user_role.is_active = True
                    user_role.save()
                
                # Log role assignment
                AuditLog.objects.create(
                    user=request.user,
                    action='ROLE_ASSIGN',
                    resource_type='USER',
                    resource_id=str(user.id),
                    details={
                        'assigned_role': role_name,
                        'target_user': user.email
                    },
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                return Response({
                    'message': f'Role {role_name} assigned to {user.email} successfully'
                }, status=status.HTTP_200_OK)
                
            except (User.DoesNotExist, Role.DoesNotExist) as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='assign-permission')
    def assign_permission(self, request):
        """
        Assign permission to user (SuperUser only)
        """
        serializer = AssignPermissionSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            permission_codename = serializer.validated_data['permission_codename']
            expires_at = serializer.validated_data.get('expires_at')
            
            try:
                user = User.objects.get(id=user_id)
                permission = Permission.objects.get(codename=permission_codename)
                
                # Create or update user permission
                user_permission, created = UserPermission.objects.get_or_create(
                    user=user,
                    permission=permission,
                    defaults={
                        'assigned_by': request.user,
                        'expires_at': expires_at
                    }
                )
                
                if not created:
                    user_permission.assigned_by = request.user
                    user_permission.expires_at = expires_at
                    user_permission.is_active = True
                    user_permission.save()
                
                # Log permission assignment
                AuditLog.objects.create(
                    user=request.user,
                    action='PERMISSION_GRANT',
                    resource_type='USER',
                    resource_id=str(user.id),
                    details={
                        'assigned_permission': permission_codename,
                        'target_user': user.email
                    },
                    ip_address=get_client_ip(request),
                    user_agent=request.META.get('HTTP_USER_AGENT', '')
                )
                
                return Response({
                    'message': f'Permission {permission_codename} assigned to {user.email} successfully'
                }, status=status.HTTP_200_OK)
                
            except (User.DoesNotExist, Permission.DoesNotExist) as e:
                return Response({
                    'error': str(e)
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================================
# ROLE AND PERMISSION MANAGEMENT
# ===============================================

class RoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for role management (SuperUser only)
    """
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]


class PermissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for permission management (SuperUser only)
    """
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]


# ===============================================
# DOCTOR SPECIFIC VIEWS
# ===============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@require_permission('upload_scan')
def upload_scan(request):
    """
    Upload scan endpoint (Doctor with upload_scan permission)
    """
    # Log scan upload attempt
    AuditLog.objects.create(
        user=request.user,
        action='CREATE',
        resource_type='SCAN',
        details={'action': 'upload_scan'},
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({
        'message': 'Scan upload endpoint - implementation needed',
        'user': request.user.email,
        'permissions': [perm.codename for perm in request.user.get_all_permissions()]
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_permission('view_report')
def view_report(request):
    """
    View report endpoint (Doctor with view_report permission)
    """
    # Log report view
    AuditLog.objects.create(
        user=request.user,
        action='VIEW',
        resource_type='REPORT',
        details={'action': 'view_report'},
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    return Response({
        'message': 'Report view endpoint - implementation needed',
        'user': request.user.email,
        'permissions': [perm.codename for perm in request.user.get_all_permissions()]
    })


# ===============================================
# DASHBOARD AND STATISTICS
# ===============================================

class DashboardView(APIView):
    """
    Dashboard statistics (role-based access)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Base stats for all authenticated users
        stats = {
            'user_info': {
                'name': user.full_name or user.username,
                'email': user.email,
                'roles': [role.display_name for role in user.roles.filter(is_active=True)],
                'permissions': [perm.name for perm in user.get_all_permissions()]
            }
        }
        
        # SuperUser gets full system stats
        if user.is_superuser_role():
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            suspended_users = User.objects.filter(is_suspended=True).count()
            pending_approval = User.objects.filter(is_approved=False).count()
            
            # Users by role
            users_by_role = {}
            for role in Role.objects.filter(is_active=True):
                count = UserRole.objects.filter(role=role, is_active=True).count()
                users_by_role[role.display_name] = count
            
            # Recent logins (last 7 days)
            week_ago = timezone.now() - timedelta(days=7)
            recent_logins = list(AuditLog.objects.filter(
                action='LOGIN',
                timestamp__gte=week_ago
            ).values('user__email', 'timestamp')[:10])
            
            stats.update({
                'system_stats': {
                    'total_users': total_users,
                    'active_users': active_users,
                    'suspended_users': suspended_users,
                    'pending_approval': pending_approval,
                    'users_by_role': users_by_role,
                    'recent_logins': recent_logins
                }
            })
        
        return Response(stats)


# ===============================================
# PROFILE AND USER INFO
# ===============================================

class ProfileView(APIView):
    """User profile information"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': UserDetailSerializer(request.user).data,
                'message': 'Profile updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not request.user.check_password(current_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.set_password(new_password)
        request.user.save()
        
        # Log password change
        AuditLog.objects.create(
            user=request.user,
            action='UPDATE',
            resource_type='PASSWORD',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'message': 'Password changed successfully'
        })


# ===============================================
# AUDIT AND LOGGING
# ===============================================

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for audit logs (SuperUser only)
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by user if specified
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by action if specified
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        return queryset.order_by('-timestamp')
        
        if not login_field or not password:
            logger.warning("Missing email/username or password")
            print("Missing email/username or password")
            return Response({
                'error': 'Email/Username and password are required',
                'debug': 'CUSTOM_LOGIN_VIEW'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try to authenticate with email first, then username
        user = None
        if email:
            logger.info(f"Attempting authentication with email: {email}")
            print(f"Attempting authentication with email: {email}")
            user = authenticate(request, username=email, password=password)
            logger.info(f"Authentication result: {user}")
            print(f"Authentication result: {user}")
        elif username:
            try:
                user_obj = User.objects.get(username=username)
                logger.info(f"Found user by username: {user_obj.email}")
                print(f"Found user by username: {user_obj.email}")
                user = authenticate(request, username=user_obj.email, password=password)
                logger.info(f"Authentication result: {user}")
                print(f"Authentication result: {user}")
            except User.DoesNotExist:
                logger.warning(f"User not found with username: {username}")
                print(f"User not found with username: {username}")
                pass
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Login successful for user: {user.email}")
            print(f"Login successful for user: {user.email}")
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Login successful',
                'debug': 'CUSTOM_LOGIN_VIEW'
            }, status=status.HTTP_200_OK)
        
        logger.warning(f"Login failed for: {login_field}")
        print(f"Login failed for: {login_field}")
        return Response({
            'error': 'Invalid credentials',
            'debug': 'CUSTOM_LOGIN_VIEW'
        }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({
                'message': 'Logged out successfully'
            }, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({
                'message': 'Token not found'
            }, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    """User profile endpoint"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    """Change password endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({
                'error': 'Current password and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.user.check_password(current_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
