# Advanced RBAC User Management API Views
# Secure, feature-rich API for super admin user management

from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Count, Prefetch
from django.utils import timezone
from django.contrib.auth.models import Permission
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
import logging
from datetime import timedelta, datetime
from django.core.exceptions import PermissionDenied

from .rbac_models import (
    RBACRole, UserSecurityProfile, UserActivityLog, 
    RoleAssignment, UserSession, RBACPermissionGroup
)
from .models import User

logger = logging.getLogger(__name__)

def superuser_required(view_func):
    """Decorator to ensure only superusers can access RBAC management"""
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            raise PermissionDenied("Super admin access required")
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def log_admin_activity(user, action, description, metadata=None, severity='medium'):
    """Helper function to log admin activities"""
    UserActivityLog.objects.create(
        user=user,
        activity_type='admin_action',
        severity=severity,
        action=action,
        description=description,
        metadata=metadata or {},
        ip_address=getattr(user, '_current_ip', '127.0.0.1'),
        user_agent=getattr(user, '_current_user_agent', ''),
        performed_by=user
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_dashboard_stats(request):
    """
    Get comprehensive dashboard statistics for RBAC management
    """
    try:
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        pending_users = UserSecurityProfile.objects.filter(account_status='pending_approval').count()
        suspended_users = UserSecurityProfile.objects.filter(account_status='suspended').count()
        
        # Role statistics
        total_roles = RBACRole.objects.count()
        system_roles = RBACRole.objects.filter(is_system_role=True).count()
        custom_roles = RBACRole.objects.filter(is_system_role=False).count()
        
        # Security statistics
        failed_logins_today = UserActivityLog.objects.filter(
            activity_type='login',
            success=False,
            timestamp__date=timezone.now().date()
        ).count()
        
        active_sessions = UserSession.objects.filter(
            expires_at__gt=timezone.now()
        ).count()
        
        # Recent activity
        recent_activities = UserActivityLog.objects.select_related('user').filter(
            severity__in=['high', 'critical']
        )[:10]
        
        stats = {
            'users': {
                'total': total_users,
                'active': active_users,
                'pending': pending_users,
                'suspended': suspended_users,
                'inactive': total_users - active_users
            },
            'roles': {
                'total': total_roles,
                'system': system_roles,
                'custom': custom_roles
            },
            'security': {
                'failed_logins_today': failed_logins_today,
                'active_sessions': active_sessions,
                'suspicious_activities': recent_activities.filter(is_suspicious=True).count()
            },
            'recent_activities': [
                {
                    'id': str(activity.id),
                    'user': activity.user.username,
                    'action': activity.action,
                    'severity': activity.severity,
                    'timestamp': activity.timestamp.isoformat(),
                    'success': activity.success
                }
                for activity in recent_activities
            ]
        }
        
        log_admin_activity(
            request.user, 
            'Dashboard Access', 
            'Accessed RBAC dashboard statistics'
        )
        
        return Response(stats)
        
    except Exception as e:
        logger.error(f"Error getting RBAC dashboard stats: {str(e)}")
        return Response(
            {'error': 'Failed to load dashboard statistics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_users_management(request):
    """
    Advanced user management with filtering, search, and bulk operations
    """
    if request.method == 'GET':
        try:
            # Get query parameters
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            search = request.GET.get('search', '')
            status_filter = request.GET.get('status', '')
            role_filter = request.GET.get('role', '')
            sort_by = request.GET.get('sort', '-date_joined')
            
            # Build query
            users_query = User.objects.select_related('security_profile').prefetch_related(
                'role_assignments__role',
                'activity_logs'
            )
            
            # Apply filters
            if search:
                users_query = users_query.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search) |
                    Q(first_name__icontains=search) |
                    Q(last_name__icontains=search)
                )
            
            if status_filter:
                users_query = users_query.filter(security_profile__account_status=status_filter)
            
            if role_filter:
                users_query = users_query.filter(role_assignments__role__name=role_filter)
            
            # Apply sorting
            users_query = users_query.order_by(sort_by)
            
            # Paginate
            paginator = Paginator(users_query, page_size)
            users_page = paginator.get_page(page)
            
            # Format response
            users_data = []
            for user in users_page:
                security_profile = getattr(user, 'security_profile', None)
                active_roles = [
                    assignment.role.name 
                    for assignment in user.role_assignments.filter(status='active')
                ]
                
                last_login = user.last_login.isoformat() if user.last_login else None
                last_activity = user.activity_logs.first()
                last_activity_time = last_activity.timestamp.isoformat() if last_activity else None
                
                users_data.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'date_joined': user.date_joined.isoformat(),
                    'last_login': last_login,
                    'last_activity': last_activity_time,
                    'roles': active_roles,
                    'security_profile': {
                        'account_status': security_profile.account_status if security_profile else 'active',
                        'failed_login_attempts': security_profile.failed_login_attempts if security_profile else 0,
                        'is_locked': security_profile.is_account_locked() if security_profile else False,
                        'requires_approval': security_profile.account_status == 'pending_approval' if security_profile else False
                    }
                })
            
            response_data = {
                'users': users_data,
                'pagination': {
                    'page': page,
                    'page_size': page_size,
                    'total_pages': paginator.num_pages,
                    'total_count': paginator.count,
                    'has_next': users_page.has_next(),
                    'has_previous': users_page.has_previous()
                },
                'filters': {
                    'available_statuses': [choice[0] for choice in UserSecurityProfile.ACCOUNT_STATUS_CHOICES],
                    'available_roles': list(RBACRole.objects.values_list('name', flat=True))
                }
            }
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            return Response(
                {'error': 'Failed to load users'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    elif request.method == 'POST':
        # Bulk operations
        try:
            data = json.loads(request.body)
            operation = data.get('operation')
            user_ids = data.get('user_ids', [])
            
            if not operation or not user_ids:
                return Response(
                    {'error': 'Operation and user_ids are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            users = User.objects.filter(id__in=user_ids)
            
            if operation == 'activate':
                users.update(is_active=True)
                UserSecurityProfile.objects.filter(user__in=users).update(account_status='active')
                action = 'Bulk Activate Users'
                
            elif operation == 'deactivate':
                users.update(is_active=False)
                UserSecurityProfile.objects.filter(user__in=users).update(account_status='inactive')
                action = 'Bulk Deactivate Users'
                
            elif operation == 'suspend':
                UserSecurityProfile.objects.filter(user__in=users).update(account_status='suspended')
                action = 'Bulk Suspend Users'
                
            elif operation == 'approve':
                UserSecurityProfile.objects.filter(user__in=users).update(
                    account_status='active',
                    approved_by=request.user,
                    approved_at=timezone.now()
                )
                action = 'Bulk Approve Users'
                
            elif operation == 'reset_password':
                for user in users:
                    # Force password change on next login
                    profile, created = UserSecurityProfile.objects.get_or_create(user=user)
                    profile.force_password_change = True
                    profile.save()
                action = 'Bulk Reset Passwords'
                
            else:
                return Response(
                    {'error': 'Invalid operation'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Log the bulk operation
            log_admin_activity(
                request.user,
                action,
                f"Applied {operation} to {len(user_ids)} users",
                {'user_ids': user_ids, 'operation': operation},
                'high'
            )
            
            return Response({
                'success': True,
                'message': f"Successfully applied {operation} to {len(user_ids)} users",
                'affected_users': len(user_ids)
            })
            
        except Exception as e:
            logger.error(f"Error in bulk operation: {str(e)}")
            return Response(
                {'error': 'Failed to perform bulk operation'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_roles_management(request, role_id=None):
    """
    Advanced role management with hierarchical permissions
    """
    if request.method == 'GET':
        if role_id:
            # Get specific role details
            try:
                role = get_object_or_404(RBACRole, id=role_id)
                permissions = role.get_all_permissions()
                
                role_data = {
                    'id': str(role.id),
                    'name': role.name,
                    'display_name': role.display_name,
                    'description': role.description,
                    'category': role.category,
                    'security_level': role.security_level,
                    'parent_role': str(role.parent_role.id) if role.parent_role else None,
                    'is_system_role': role.is_system_role,
                    'requires_approval': role.requires_approval,
                    'max_session_duration': role.max_session_duration.total_seconds() if role.max_session_duration else None,
                    'ip_restriction_enabled': role.ip_restriction_enabled,
                    'permissions': [
                        {
                            'id': perm.id,
                            'name': perm.name,
                            'codename': perm.codename,
                            'content_type': perm.content_type.name
                        }
                        for perm in permissions
                    ],
                    'user_count': role.assignments.filter(status='active').count(),
                    'created_at': role.created_at.isoformat(),
                    'updated_at': role.updated_at.isoformat()
                }
                
                return Response(role_data)
                
            except Exception as e:
                logger.error(f"Error getting role details: {str(e)}")
                return Response(
                    {'error': 'Failed to load role details'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            # Get all roles with stats
            try:
                roles = RBACRole.objects.prefetch_related('permissions', 'assignments').annotate(
                    user_count=Count('assignments', filter=Q(assignments__status='active'))
                )
                
                roles_data = []
                for role in roles:
                    roles_data.append({
                        'id': str(role.id),
                        'name': role.name,
                        'display_name': role.display_name,
                        'description': role.description,
                        'category': role.category,
                        'security_level': role.security_level,
                        'is_system_role': role.is_system_role,
                        'user_count': role.user_count,
                        'permission_count': role.permissions.count(),
                        'created_at': role.created_at.isoformat()
                    })
                
                # Get available permissions for role creation
                permission_groups = RBACPermissionGroup.objects.prefetch_related('permissions')
                permission_groups_data = []
                for group in permission_groups:
                    permission_groups_data.append({
                        'name': group.name,
                        'display_name': group.display_name,
                        'category': group.category,
                        'is_critical': group.is_critical,
                        'permissions': [
                            {
                                'id': perm.id,
                                'name': perm.name,
                                'codename': perm.codename
                            }
                            for perm in group.permissions.all()
                        ]
                    })
                
                return Response({
                    'roles': roles_data,
                    'permission_groups': permission_groups_data,
                    'security_levels': RBACRole.SECURITY_LEVELS,
                    'categories': RBACRole.ROLE_CATEGORIES
                })
                
            except Exception as e:
                logger.error(f"Error getting roles: {str(e)}")
                return Response(
                    {'error': 'Failed to load roles'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    
    elif request.method == 'POST':
        # Create new role
        try:
            data = json.loads(request.body)
            
            # Validate required fields
            required_fields = ['name', 'display_name', 'security_level']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {'error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Check if role name already exists
            if RBACRole.objects.filter(name=data['name']).exists():
                return Response(
                    {'error': 'Role name already exists'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create role
            role = RBACRole.objects.create(
                name=data['name'],
                display_name=data['display_name'],
                description=data.get('description', ''),
                category=data.get('category', 'custom'),
                security_level=data['security_level'],
                parent_role_id=data.get('parent_role') if data.get('parent_role') else None,
                requires_approval=data.get('requires_approval', False),
                ip_restriction_enabled=data.get('ip_restriction_enabled', False),
                created_by=request.user
            )
            
            # Set session duration if provided
            if data.get('max_session_duration'):
                role.max_session_duration = timedelta(seconds=data['max_session_duration'])
                role.save()
            
            # Add permissions
            permission_ids = data.get('permissions', [])
            if permission_ids:
                permissions = Permission.objects.filter(id__in=permission_ids)
                role.permissions.set(permissions)
            
            log_admin_activity(
                request.user,
                'Create Role',
                f"Created new role: {role.name}",
                {'role_id': str(role.id), 'role_data': data},
                'high'
            )
            
            return Response({
                'success': True,
                'message': f"Role '{role.display_name}' created successfully",
                'role_id': str(role.id)
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating role: {str(e)}")
            return Response(
                {'error': 'Failed to create role'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_activity_logs(request):
    """
    Get comprehensive activity logs with advanced filtering
    """
    try:
        # Get query parameters
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 50))
        user_filter = request.GET.get('user', '')
        activity_type = request.GET.get('activity_type', '')
        severity = request.GET.get('severity', '')
        date_from = request.GET.get('date_from', '')
        date_to = request.GET.get('date_to', '')
        search = request.GET.get('search', '')
        
        # Build query
        logs_query = UserActivityLog.objects.select_related('user', 'performed_by')
        
        # Apply filters
        if user_filter:
            logs_query = logs_query.filter(user__username__icontains=user_filter)
        
        if activity_type:
            logs_query = logs_query.filter(activity_type=activity_type)
        
        if severity:
            logs_query = logs_query.filter(severity=severity)
        
        if date_from:
            logs_query = logs_query.filter(timestamp__gte=datetime.fromisoformat(date_from))
        
        if date_to:
            logs_query = logs_query.filter(timestamp__lte=datetime.fromisoformat(date_to))
        
        if search:
            logs_query = logs_query.filter(
                Q(action__icontains=search) |
                Q(description__icontains=search)
            )
        
        # Paginate
        paginator = Paginator(logs_query, page_size)
        logs_page = paginator.get_page(page)
        
        # Format response
        logs_data = []
        for log in logs_page:
            logs_data.append({
                'id': str(log.id),
                'user': {
                    'username': log.user.username,
                    'email': log.user.email,
                    'full_name': f"{log.user.first_name} {log.user.last_name}".strip()
                },
                'activity_type': log.activity_type,
                'severity': log.severity,
                'action': log.action,
                'description': log.description,
                'metadata': log.metadata,
                'ip_address': log.ip_address,
                'success': log.success,
                'error_message': log.error_message,
                'performed_by': log.performed_by.username if log.performed_by else None,
                'timestamp': log.timestamp.isoformat()
            })
        
        return Response({
            'logs': logs_data,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_pages': paginator.num_pages,
                'total_count': paginator.count,
                'has_next': logs_page.has_next(),
                'has_previous': logs_page.has_previous()
            },
            'filters': {
                'activity_types': [choice[0] for choice in UserActivityLog.ACTIVITY_TYPES],
                'severity_levels': [choice[0] for choice in UserActivityLog.SEVERITY_LEVELS]
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting activity logs: {str(e)}")
        return Response(
            {'error': 'Failed to load activity logs'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_security_monitoring(request):
    """
    Advanced security monitoring and threat detection
    """
    try:
        # Get active sessions with risk assessment
        active_sessions = UserSession.objects.select_related('user').filter(
            expires_at__gt=timezone.now()
        ).order_by('-risk_score', '-last_activity')
        
        # Suspicious activities in last 24 hours
        suspicious_activities = UserActivityLog.objects.select_related('user').filter(
            timestamp__gte=timezone.now() - timedelta(hours=24),
            severity__in=['high', 'critical']
        ).order_by('-timestamp')[:20]
        
        # Failed login attempts by IP
        failed_logins = UserActivityLog.objects.filter(
            activity_type='login',
            success=False,
            timestamp__gte=timezone.now() - timedelta(hours=24)
        ).values('ip_address').annotate(
            count=Count('id'),
            latest=models.Max('timestamp')
        ).order_by('-count')[:10]
        
        # Locked accounts
        locked_accounts = UserSecurityProfile.objects.select_related('user').filter(
            account_locked_until__gt=timezone.now()
        )
        
        # Users requiring approval
        pending_approvals = UserSecurityProfile.objects.select_related('user').filter(
            account_status='pending_approval'
        )
        
        security_data = {
            'active_sessions': [
                {
                    'session_key': session.session_key,
                    'user': session.user.username,
                    'ip_address': session.ip_address,
                    'location': session.location,
                    'risk_score': session.risk_score,
                    'is_suspicious': session.is_suspicious,
                    'last_activity': session.last_activity.isoformat(),
                    'expires_at': session.expires_at.isoformat()
                }
                for session in active_sessions[:20]
            ],
            'suspicious_activities': [
                {
                    'user': activity.user.username,
                    'action': activity.action,
                    'severity': activity.severity,
                    'ip_address': activity.ip_address,
                    'timestamp': activity.timestamp.isoformat(),
                    'success': activity.success,
                    'error_message': activity.error_message
                }
                for activity in suspicious_activities
            ],
            'failed_logins_by_ip': [
                {
                    'ip_address': item['ip_address'],
                    'count': item['count'],
                    'latest_attempt': item['latest'].isoformat()
                }
                for item in failed_logins
            ],
            'locked_accounts': [
                {
                    'user': profile.user.username,
                    'email': profile.user.email,
                    'locked_until': profile.account_locked_until.isoformat(),
                    'failed_attempts': profile.failed_login_attempts
                }
                for profile in locked_accounts
            ],
            'pending_approvals': [
                {
                    'user': profile.user.username,
                    'email': profile.user.email,
                    'created_at': profile.created_at.isoformat()
                }
                for profile in pending_approvals
            ]
        }
        
        return Response(security_data)
        
    except Exception as e:
        logger.error(f"Error getting security monitoring data: {str(e)}")
        return Response(
            {'error': 'Failed to load security monitoring data'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Registration Notification Management Views (Super Admin Only)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_registration_notifications(request):
    """
    Get all doctor registration notifications for super admin approval
    """
    try:
        from .rbac_models import RegistrationNotification
        
        # Get filter parameters
        status_filter = request.GET.get('status', 'all')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        
        # Base queryset
        notifications = RegistrationNotification.objects.select_related('processed_by')
        
        # Apply status filter
        if status_filter != 'all':
            notifications = notifications.filter(status=status_filter)
        
        # Order by creation date (newest first)
        notifications = notifications.order_by('-created_at')
        
        # Get statistics
        today = timezone.now().date()
        stats = {
            'pending': RegistrationNotification.objects.filter(status='pending').count(),
            'approved': RegistrationNotification.objects.filter(status='approved').count(),
            'rejected': RegistrationNotification.objects.filter(status='rejected').count(),
            'today': RegistrationNotification.objects.filter(created_at__date=today).count(),
        }
        
        # Pagination
        total_count = notifications.count()
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        paginated_notifications = notifications[start_index:end_index]
        
        # Serialize notifications
        notifications_data = []
        for notification in paginated_notifications:
            notifications_data.append({
                'id': str(notification.id),
                'first_name': notification.first_name,
                'last_name': notification.last_name,
                'email': notification.email,
                'phone': notification.phone,
                'date_of_birth': notification.date_of_birth,
                'medical_license': notification.medical_license,
                'specialization': notification.specialization,
                'years_of_experience': notification.years_of_experience,
                'workplace': notification.workplace,
                'status': notification.status,
                'processed_by': notification.processed_by.username if notification.processed_by else None,
                'processed_at': notification.processed_at,
                'rejection_reason': notification.rejection_reason,
                'additional_notes': notification.additional_notes,
                'created_at': notification.created_at,
                'updated_at': notification.updated_at,
            })
        
        # Log activity
        UserActivityLog.objects.create(
            user=request.user,
            activity_type='data_access',
            description='Accessed registration notifications',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return Response({
            'success': True,
            'notifications': notifications_data,
            'stats': stats,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': (total_count + page_size - 1) // page_size
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting registration notifications: {str(e)}")
        return Response(
            {'error': 'Failed to load registration notifications'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_approve_registration(request, notification_id):
    """
    Approve a doctor registration and create user account
    """
    try:
        from .rbac_models import RegistrationNotification
        from django.contrib.auth import get_user_model
        from .models import Role
        
        User = get_user_model()
        
        # Get notification
        notification = get_object_or_404(RegistrationNotification, id=notification_id)
        
        if notification.status != 'pending':
            return Response(
                {'error': 'This registration has already been processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user account
        user_data = request.data.get('user_data', {})
        username = user_data.get('username', notification.email.split('@')[0])
        
        # Check if user already exists
        if User.objects.filter(email=notification.email).exists():
            return Response(
                {'error': 'User with this email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=notification.email,
            first_name=notification.first_name,
            last_name=notification.last_name,
            is_doctor=True,
            is_active=True
        )
        
        # Assign doctor role
        try:
            doctor_role = Role.objects.get(name='doctor')
            user.roles.add(doctor_role)
        except Role.DoesNotExist:
            logger.warning("Doctor role not found, user created without role")
        
        # Approve notification
        notification.approve(request.user)
        
        # Log activity
        UserActivityLog.objects.create(
            user=request.user,
            activity_type='user_management',
            description=f'Approved registration for Dr. {notification.get_full_name()}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return Response({
            'success': True,
            'message': f'Registration approved for Dr. {notification.get_full_name()}',
            'user_id': str(user.id),
            'username': user.username
        })
        
    except Exception as e:
        logger.error(f"Error approving registration: {str(e)}")
        return Response(
            {'error': 'Failed to approve registration'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_reject_registration(request, notification_id):
    """
    Reject a doctor registration
    """
    try:
        from .rbac_models import RegistrationNotification
        
        # Get notification
        notification = get_object_or_404(RegistrationNotification, id=notification_id)
        
        if notification.status != 'pending':
            return Response(
                {'error': 'This registration has already been processed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get rejection reason
        rejection_reason = request.data.get('rejection_reason', 'No reason provided')
        
        # Reject notification
        notification.reject(request.user, rejection_reason)
        
        # Log activity
        UserActivityLog.objects.create(
            user=request.user,
            activity_type='user_management',
            description=f'Rejected registration for Dr. {notification.get_full_name()}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return Response({
            'success': True,
            'message': f'Registration rejected for Dr. {notification.get_full_name()}'
        })
        
    except Exception as e:
        logger.error(f"Error rejecting registration: {str(e)}")
        return Response(
            {'error': 'Failed to reject registration'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_delete_notification(request, notification_id):
    """
    Delete a registration notification
    """
    try:
        from .rbac_models import RegistrationNotification
        
        # Get notification
        notification = get_object_or_404(RegistrationNotification, id=notification_id)
        
        # Store info for logging
        doctor_name = notification.get_full_name()
        
        # Delete notification
        notification.delete()
        
        # Log activity
        UserActivityLog.objects.create(
            user=request.user,
            activity_type='data_management',
            description=f'Deleted registration notification for Dr. {doctor_name}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        
        return Response({
            'success': True,
            'message': f'Notification deleted for Dr. {doctor_name}'
        })
        
    except Exception as e:
        logger.error(f"Error deleting notification: {str(e)}")
        return Response(
            {'error': 'Failed to delete notification'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@superuser_required
def rbac_notification_stats(request):
    """
    Get registration notification statistics
    """
    try:
        from .rbac_models import RegistrationNotification
        
        today = timezone.now().date()
        this_week_start = today - timedelta(days=today.weekday())
        this_month_start = today.replace(day=1)
        
        stats = {
            'total_notifications': RegistrationNotification.objects.count(),
            'pending_approvals': RegistrationNotification.objects.filter(status='pending').count(),
            'approved_today': RegistrationNotification.objects.filter(
                status='approved', 
                processed_at__date=today
            ).count(),
            'rejected_today': RegistrationNotification.objects.filter(
                status='rejected', 
                processed_at__date=today
            ).count(),
            'registrations_this_week': RegistrationNotification.objects.filter(
                created_at__date__gte=this_week_start
            ).count(),
            'registrations_this_month': RegistrationNotification.objects.filter(
                created_at__date__gte=this_month_start
            ).count(),
        }
        
        # Daily registration trend (last 7 days)
        daily_stats = []
        for i in range(7):
            date = today - timedelta(days=i)
            count = RegistrationNotification.objects.filter(created_at__date=date).count()
            daily_stats.append({
                'date': date,
                'count': count
            })
        
        return Response({
            'success': True,
            'stats': stats,
            'daily_trend': daily_stats
        })
        
    except Exception as e:
        logger.error(f"Error getting notification stats: {str(e)}")
        return Response(
            {'error': 'Failed to load notification statistics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
