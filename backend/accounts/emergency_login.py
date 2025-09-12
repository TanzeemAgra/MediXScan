from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
import json
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def emergency_login(request):
    """Emergency login endpoint that bypasses all middleware issues"""
    try:
        print("=== EMERGENCY LOGIN CALLED ===")
        logger.info("Emergency login attempt")
        
        # Parse request data
        try:
            if hasattr(request, 'body') and request.body:
                data = json.loads(request.body.decode('utf-8'))
            else:
                return JsonResponse({'error': 'No request body provided'}, status=400)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        print(f"Email: {email}")
        print(f"Password provided: {bool(password)}")
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        # Validate email format
        if '@' not in email:
            return JsonResponse({'error': 'Invalid email format'}, status=400)
        
        # Direct authentication test
        try:
            user = User.objects.get(email=email)
            print(f"User found: {user.email}")
            print(f"User active: {user.is_active}")
            
            if not user.is_active:
                return JsonResponse({'error': 'Account is disabled'}, status=400)
            
            # Check password manually
            if user.check_password(password):
                print("Password check passed")
                
                # Create or get existing token
                token, created = Token.objects.get_or_create(user=user)
                print(f"Token created: {created}")
                
                # Prepare user data
                user_data = {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'full_name': getattr(user, 'full_name', ''),
                    'first_name': getattr(user, 'first_name', ''),
                    'last_name': getattr(user, 'last_name', ''),
                }
                
                logger.info(f"Emergency login successful for user: {email}")
                
                return JsonResponse({
                    'success': True,
                    'token': token.key,
                    'user': user_data,
                    'message': 'Login successful'
                }, status=200)
            else:
                print("Password check failed")
                logger.warning(f"Invalid password attempt for user: {email}")
                return JsonResponse({'error': 'Invalid password'}, status=400)
                
        except User.DoesNotExist:
            print(f"User {email} not found")
            logger.warning(f"Login attempt for non-existent user: {email}")
            return JsonResponse({'error': 'User not found'}, status=400)
            
    except Exception as e:
        print(f"Emergency login error: {e}")
        logger.error(f"Emergency login system error: {e}")
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
