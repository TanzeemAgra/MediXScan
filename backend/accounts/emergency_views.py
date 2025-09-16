"""
Emergency Authentication Diagnostic API
This will be deployed to Railway to help diagnose the authentication issues
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
import json
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def emergency_auth_diagnostic(request):
    """
    Emergency diagnostic endpoint to check authentication system
    """
    
    if request.method == "GET":
        # GET: Return diagnostic information
        try:
            # Check database connection
            user_count = User.objects.count()
            superuser_count = User.objects.filter(is_superuser=True).count()
            
            # Check if admin@rugrel.in exists
            admin_user = User.objects.filter(email='admin@rugrel.in').first()
            
            # Get all users for debugging
            all_users = []
            for user in User.objects.all()[:10]:  # Limit to 10 for safety
                all_users.append({
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_active': user.is_active,
                    'is_superuser': user.is_superuser,
                    'password_hash': user.password[:50] + "..." if user.password else None
                })
            
            return JsonResponse({
                'status': 'ok',
                'database_connected': True,
                'total_users': user_count,
                'superuser_count': superuser_count,
                'admin_user_exists': admin_user is not None,
                'admin_user_details': {
                    'id': admin_user.id if admin_user else None,
                    'username': admin_user.username if admin_user else None,
                    'email': admin_user.email if admin_user else None,
                    'is_active': admin_user.is_active if admin_user else None,
                    'is_superuser': admin_user.is_superuser if admin_user else None,
                } if admin_user else None,
                'all_users': all_users,
                'message': 'Diagnostic check completed'
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'error': str(e),
                'database_connected': False
            }, status=500)
    
    elif request.method == "POST":
        # POST: Create user and test authentication
        try:
            data = json.loads(request.body)
            action = data.get('action', 'test_auth')
            
            if action == 'create_user':
                # Force create the admin user
                try:
                    # Delete existing users with same email/username
                    User.objects.filter(
                        email='admin@rugrel.in'
                    ).delete()
                    
                    User.objects.filter(
                        username='admin@rugrel.in'  
                    ).delete()
                    
                    # Create new superuser
                    user = User.objects.create_superuser(
                        username='admin@rugrel.in',
                        email='admin@rugrel.in',
                        password='Rugrel@321'
                    )
                    
                    return JsonResponse({
                        'status': 'success',
                        'action': 'user_created',
                        'user_id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_superuser': user.is_superuser,
                        'message': 'User created successfully'
                    })
                    
                except Exception as create_error:
                    return JsonResponse({
                        'status': 'error',
                        'action': 'user_creation_failed',
                        'error': str(create_error)
                    }, status=500)
            
            elif action == 'test_auth':
                # Test authentication
                email = data.get('email', 'admin@rugrel.in')
                password = data.get('password', 'Rugrel@321')
                
                # Test user lookup
                user = User.objects.filter(email=email).first()
                
                if not user:
                    return JsonResponse({
                        'status': 'error',
                        'action': 'auth_test',
                        'error': 'User not found in database',
                        'debug': 'user_lookup_failed'
                    }, status=400)
                
                # Test authentication methods
                auth_results = {}
                
                # Method 1: Standard authentication
                auth_user1 = authenticate(username=user.username, password=password)
                auth_results['auth_with_username'] = auth_user1 is not None
                
                # Method 2: Email as username
                auth_user2 = authenticate(username=user.email, password=password)
                auth_results['auth_with_email'] = auth_user2 is not None
                
                # Method 3: Direct password check
                password_check = user.check_password(password)
                auth_results['direct_password_check'] = password_check
                
                # Final result
                auth_success = auth_user1 or auth_user2 or password_check
                
                return JsonResponse({
                    'status': 'success' if auth_success else 'error',
                    'action': 'auth_test',
                    'user_found': True,
                    'user_details': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_active': user.is_active,
                        'is_superuser': user.is_superuser
                    },
                    'auth_results': auth_results,
                    'overall_auth_success': auth_success,
                    'message': 'Authentication successful' if auth_success else 'Authentication failed'
                })
                
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'error': 'Invalid JSON in request body'
            }, status=400)
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'error': str(e)
            }, status=500)


@csrf_exempt  
@require_http_methods(["POST"])
def emergency_login_test(request):
    """
    Emergency login endpoint that replicates the main login logic
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({
                'error': 'Email and password required',
                'debug': 'EMERGENCY_LOGIN_MISSING_FIELDS'
            }, status=400)
        
        # Enhanced user lookup (exactly like our enhanced LoginView)
        user = None
        
        # Method 1: Direct email lookup
        user = User.objects.filter(email=email).first()
        if user:
            lookup_method = 'email'
        
        # Method 2: Username lookup  
        if not user:
            user = User.objects.filter(username=email).first()
            if user:
                lookup_method = 'username'
        
        # Method 3: Case-insensitive combined lookup
        if not user:
            from django.db.models import Q
            user = User.objects.filter(
                Q(email__iexact=email) | 
                Q(username__iexact=email)
            ).first()
            if user:
                lookup_method = 'case_insensitive'
        
        if not user:
            return JsonResponse({
                'error': 'User not found',
                'debug': 'EMERGENCY_LOGIN_USER_NOT_FOUND',
                'searched_email': email
            }, status=400)
        
        # Enhanced Authentication (exactly like our enhanced LoginView)
        authenticated_user = None
        auth_method = None
        
        # Method 1: Standard Django authentication with username
        auth_user = authenticate(username=user.username, password=password)
        if auth_user:
            authenticated_user = auth_user
            auth_method = 'username_auth'
        
        # Method 2: Authentication with email as username
        if not authenticated_user:
            auth_user = authenticate(username=user.email, password=password)
            if auth_user:
                authenticated_user = auth_user
                auth_method = 'email_auth'
        
        # Method 3: Direct password verification
        if not authenticated_user:
            if user.check_password(password):
                authenticated_user = user
                auth_method = 'direct_password'
        
        if not authenticated_user:
            return JsonResponse({
                'error': 'Invalid credentials',
                'debug': 'EMERGENCY_LOGIN_AUTH_FAILED',
                'user_found': True,
                'lookup_method': lookup_method
            }, status=400)
        
        # Success!
        from rest_framework.authtoken.models import Token
        token, created = Token.objects.get_or_create(user=authenticated_user)
        
        return JsonResponse({
            'access_token': token.key,
            'user': {
                'id': authenticated_user.id,
                'username': authenticated_user.username,
                'email': authenticated_user.email,
                'is_superuser': authenticated_user.is_superuser
            },
            'debug': {
                'lookup_method': lookup_method,
                'auth_method': auth_method,
                'source': 'emergency_login'
            },
            'message': 'Emergency login successful'
        })
        
    except Exception as e:
        return JsonResponse({
            'error': 'Emergency login system error',
            'debug': str(e)
        }, status=500)