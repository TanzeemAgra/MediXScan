"""
Enhanced RBAC Service for Advanced User Management
Provides API endpoints for comprehensive user management features
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
from django.db.models import Q, Count
from django.core.paginator import Paginator
from django.contrib.auth import get_user_model
from accounts.models import Role, UserRole, Permission
import json
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class EnhancedUserManagementAPI:
    """Enhanced API endpoints for advanced user management"""
    
    @staticmethod
    @csrf_exempt
    @login_required
    def get_dashboard_stats(request):
        """Get comprehensive dashboard statistics"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            # Calculate statistics
            total_users = User.objects.count()
            active_users = User.objects.filter(is_active=True).count()
            total_roles = Role.objects.count()
            
            # Mock some advanced metrics (implement real logic as needed)
            active_sessions = 15  # Replace with real session count
            failed_logins = 5     # Replace with real failed login count from last 24h
            suspended_accounts = User.objects.filter(is_suspended=True).count()
            
            stats = {
                'totalUsers': total_users,
                'activeUsers': active_users,
                'totalRoles': total_roles,
                'activeSessions': active_sessions,
                'failedLogins': failed_logins,
                'suspendedAccounts': suspended_accounts
            }
            
            return JsonResponse(stats)
            
        except Exception as e:
            logger.error(f"Error getting dashboard stats: {str(e)}")
            return JsonResponse({'error': 'Failed to get dashboard stats'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def get_users_advanced(request):
        """Get users with advanced filtering and pagination"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            # Get query parameters
            search = request.GET.get('search', '')
            filter_status = request.GET.get('filter', 'all')
            role_filter = request.GET.get('role_filter', 'all')
            sort_by = request.GET.get('sort_by', 'created_at')
            sort_order = request.GET.get('sort_order', 'desc')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Build queryset
            queryset = User.objects.all()
            
            # Apply search filter
            if search:
                queryset = queryset.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search) |
                    Q(first_name__icontains=search) |
                    Q(last_name__icontains=search) |
                    Q(department__icontains=search)
                )
            
            # Apply status filter
            if filter_status != 'all':
                if filter_status == 'active':
                    queryset = queryset.filter(is_active=True)
                elif filter_status == 'inactive':
                    queryset = queryset.filter(is_active=False)
                elif filter_status == 'suspended':
                    queryset = queryset.filter(is_suspended=True)
                elif filter_status == 'pending':
                    queryset = queryset.filter(is_approved=False)
            
            # Apply role filter
            if role_filter != 'all':
                queryset = queryset.filter(roles__name=role_filter)
            
            # Apply sorting
            if sort_order == 'desc':
                sort_by = f'-{sort_by}'
            queryset = queryset.order_by(sort_by)
            
            # Paginate
            paginator = Paginator(queryset, per_page)
            page_obj = paginator.get_page(page)
            
            # Serialize users
            users_data = []
            for user in page_obj:
                user_roles = user.roles.all()
                users_data.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': user.full_name,
                    'phone_number': user.phone_number,
                    'employee_id': user.employee_id,
                    'department': user.department,
                    'is_active': user.is_active,
                    'is_approved': user.is_approved,
                    'is_suspended': getattr(user, 'is_suspended', False),
                    'email_verified': True,  # Mock value
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'last_login_ip': user.last_login_ip,
                    'created_at': user.created_at.isoformat(),
                    'roles': [
                        {
                            'id': role.id,
                            'name': role.name,
                            'display_name': role.display_name
                        } for role in user_roles
                    ]
                })
            
            response_data = {
                'users': users_data,
                'pagination': {
                    'current_page': page,
                    'total_pages': paginator.num_pages,
                    'total_items': paginator.count,
                    'per_page': per_page,
                    'has_next': page_obj.has_next(),
                    'has_previous': page_obj.has_previous()
                }
            }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            return JsonResponse({'error': 'Failed to get users'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def create_advanced_user(request):
        """Create user with advanced settings"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            if request.method != 'POST':
                return JsonResponse({'error': 'Method not allowed'}, status=405)
            
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['username', 'email', 'first_name', 'last_name', 'password']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({'error': f'{field} is required'}, status=400)
            
            # Check if username or email already exists
            if User.objects.filter(username=data['username']).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            
            # Create user with transaction
            with transaction.atomic():
                user = User.objects.create_user(
                    username=data['username'],
                    email=data['email'],
                    password=data['password'],
                    first_name=data['first_name'],
                    last_name=data['last_name'],
                    phone_number=data.get('phone_number', ''),
                    employee_id=data.get('employee_id', ''),
                    department=data.get('department', ''),
                    full_name=f"{data['first_name']} {data['last_name']}",
                    is_active=data.get('is_active', True),
                    is_approved=data.get('is_approved', True)
                )
                
                # Assign roles
                role_ids = data.get('roles', [])
                for role_id in role_ids:
                    try:
                        role = Role.objects.get(id=role_id)
                        UserRole.objects.create(
                            user=user,
                            role=role,
                            assigned_by=request.user,
                            is_active=True
                        )
                    except Role.DoesNotExist:
                        logger.warning(f"Role {role_id} not found when creating user {user.username}")
                
                # Log user creation
                logger.info(f"User {user.username} created by {request.user.username}")
                
                # TODO: Send welcome email if requested
                if data.get('send_welcome_email', True):
                    # Implement email sending logic here
                    pass
                
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': user.full_name,
                    'is_active': user.is_active,
                    'is_approved': user.is_approved,
                    'created_at': user.created_at.isoformat()
                }
                
                return JsonResponse({
                    'message': 'User created successfully',
                    'user': user_data
                }, status=201)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return JsonResponse({'error': 'Failed to create user'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def bulk_update_users(request):
        """Bulk update multiple users"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            if request.method != 'POST':
                return JsonResponse({'error': 'Method not allowed'}, status=405)
            
            data = json.loads(request.body)
            user_ids = data.get('user_ids', [])
            updates = data.get('updates', {})
            
            if not user_ids:
                return JsonResponse({'error': 'No user IDs provided'}, status=400)
            
            # Update users
            updated_count = User.objects.filter(id__in=user_ids).update(**updates)
            
            logger.info(f"Bulk updated {updated_count} users by {request.user.username}")
            
            return JsonResponse({
                'message': f'Successfully updated {updated_count} users',
                'updated_count': updated_count
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error bulk updating users: {str(e)}")
            return JsonResponse({'error': 'Failed to bulk update users'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def bulk_delete_users(request):
        """Bulk delete multiple users"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            if request.method != 'POST':
                return JsonResponse({'error': 'Method not allowed'}, status=405)
            
            data = json.loads(request.body)
            user_ids = data.get('user_ids', [])
            
            if not user_ids:
                return JsonResponse({'error': 'No user IDs provided'}, status=400)
            
            # Prevent deleting yourself
            if request.user.id in user_ids:
                return JsonResponse({'error': 'Cannot delete your own account'}, status=400)
            
            # Delete users
            deleted_count = User.objects.filter(id__in=user_ids).delete()[0]
            
            logger.warning(f"Bulk deleted {deleted_count} users by {request.user.username}")
            
            return JsonResponse({
                'message': f'Successfully deleted {deleted_count} users',
                'deleted_count': deleted_count
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error bulk deleting users: {str(e)}")
            return JsonResponse({'error': 'Failed to bulk delete users'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def get_system_metrics(request):
        """Get system performance metrics"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            # Mock system metrics (implement real monitoring as needed)
            metrics = {
                'cpu_usage': 25,        # percentage
                'memory_usage': 45,     # percentage
                'disk_usage': 60,       # percentage
                'active_connections': 12,
                'response_time': 150    # milliseconds
            }
            
            return JsonResponse(metrics)
            
        except Exception as e:
            logger.error(f"Error getting system metrics: {str(e)}")
            return JsonResponse({'error': 'Failed to get system metrics'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def get_online_users(request):
        """Get list of currently online users"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            # Mock online users (implement real session tracking as needed)
            # In a real implementation, you'd track active sessions
            recent_cutoff = datetime.now() - timedelta(minutes=15)
            online_users = User.objects.filter(
                last_login__gte=recent_cutoff,
                is_active=True
            )
            
            online_data = [
                {
                    'id': user.id,
                    'username': user.username,
                    'full_name': user.full_name,
                    'last_activity': user.last_login.isoformat() if user.last_login else None
                }
                for user in online_users
            ]
            
            return JsonResponse(online_data, safe=False)
            
        except Exception as e:
            logger.error(f"Error getting online users: {str(e)}")
            return JsonResponse({'error': 'Failed to get online users'}, status=500)
    
    @staticmethod
    @csrf_exempt
    @login_required
    def get_security_events(request):
        """Get security events and alerts"""
        try:
            if not request.user.is_superuser:
                return JsonResponse({'error': 'Permission denied'}, status=403)
            
            # Mock security events (implement real security logging as needed)
            events = [
                {
                    'id': 1,
                    'type': 'failed_login',
                    'user': 'admin',
                    'ip_address': '192.168.1.100',
                    'timestamp': datetime.now().isoformat(),
                    'severity': 'medium'
                },
                {
                    'id': 2,
                    'type': 'suspicious_activity',
                    'user': 'testuser',
                    'ip_address': '10.0.0.50',
                    'timestamp': (datetime.now() - timedelta(hours=2)).isoformat(),
                    'severity': 'high'
                }
            ]
            
            return JsonResponse(events, safe=False)
            
        except Exception as e:
            logger.error(f"Error getting security events: {str(e)}")
            return JsonResponse({'error': 'Failed to get security events'}, status=500)
