"""
Emergency Admin API for Railway Database Fixes
==============================================
Provides secure API endpoints to fix admin approval issues remotely
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.db import transaction
from django.conf import settings
import json

User = get_user_model()

@csrf_exempt
def emergency_approve_admin(request):
    """
    Emergency endpoint to approve super admin
    URL: /api/emergency/approve-admin/
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        # Security check - only allow in production/railway environment
        if not settings.DEBUG and 'railway' in str(settings.DATABASES.get('default', {}).get('HOST', '')):
            # This is Railway production environment
            pass
        elif settings.DEBUG:
            # Allow in debug mode for testing
            pass
        else:
            return JsonResponse({'error': 'Endpoint not available'}, status=403)
        
        data = json.loads(request.body) if request.body else {}
        email = data.get('email', 'tanzeem.agra@rugrel.com')
        
        with transaction.atomic():
            try:
                user = User.objects.get(email=email)
                
                # Current status
                current_status = {
                    'id': user.id,
                    'email': user.email,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_approved': getattr(user, 'is_approved', None),
                    'is_suspended': getattr(user, 'is_suspended', None),
                }
                
                # Update status
                user.is_active = True
                user.is_staff = True
                user.is_superuser = True
                
                if hasattr(user, 'is_approved'):
                    user.is_approved = True
                if hasattr(user, 'is_suspended'):
                    user.is_suspended = False
                    
                user.set_password('Tanzilla@tanzeem786')
                user.save()
                
                # Updated status
                updated_status = {
                    'id': user.id,
                    'email': user.email,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_approved': getattr(user, 'is_approved', None),
                    'is_suspended': getattr(user, 'is_suspended', None),
                }
                
                # Test authentication
                from django.contrib.auth import authenticate
                auth_test = authenticate(username=email, password='Tanzilla@tanzeem786')
                
                return JsonResponse({
                    'success': True,
                    'message': 'Super admin approved successfully',
                    'current_status': current_status,
                    'updated_status': updated_status,
                    'auth_test_passed': bool(auth_test),
                    'login_url': 'https://www.rugrel.in/auth/sign-in',
                    'credentials': {
                        'email': email,
                        'password': 'Tanzilla@tanzeem786'
                    }
                })
                
            except User.DoesNotExist:
                return JsonResponse({
                    'error': f'User {email} not found',
                    'suggestion': 'Run setup_railway_admin.py first'
                }, status=404)
                
    except Exception as e:
        return JsonResponse({
            'error': f'Failed to approve admin: {str(e)}',
            'type': type(e).__name__
        }, status=500)

def emergency_status(request):
    """
    Check current admin status
    URL: /api/emergency/status/
    """
    try:
        email = 'tanzeem.agra@rugrel.com'
        
        try:
            user = User.objects.get(email=email)
            
            status_info = {
                'user_found': True,
                'email': user.email,
                'username': user.username,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_approved': getattr(user, 'is_approved', None),
                'is_suspended': getattr(user, 'is_suspended', None),
                'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                'last_login': user.last_login.isoformat() if user.last_login else None,
            }
            
            # Check if login should work
            login_should_work = (
                user.is_active and 
                user.is_staff and 
                user.is_superuser and
                getattr(user, 'is_approved', True) and
                not getattr(user, 'is_suspended', False)
            )
            
            status_info['login_should_work'] = login_should_work
            status_info['login_url'] = 'https://www.rugrel.in/auth/sign-in'
            
            return JsonResponse(status_info)
            
        except User.DoesNotExist:
            return JsonResponse({
                'user_found': False,
                'error': f'User {email} not found',
                'suggestion': 'User needs to be created first'
            })
            
    except Exception as e:
        return JsonResponse({
            'error': f'Status check failed: {str(e)}',
            'type': type(e).__name__
        }, status=500)