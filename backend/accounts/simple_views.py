import json
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def simple_login(request):
    """Simplified login endpoint for testing"""
    print("=== SIMPLE LOGIN ENDPOINT CALLED ===")
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
                'error': 'Email and password required',
                'source': 'simple_login'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        try:
            user_obj = User.objects.get(email=email)
            print(f"User found: {user_obj.email}, active: {user_obj.is_active}")
        except User.DoesNotExist:
            print(f"User {email} does not exist")
            return Response({
                'error': 'User not found',
                'source': 'simple_login'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate
        user = authenticate(username=email, password=password)
        print(f"Authentication result: {user}")
        
        if user:
            if not user.is_active:
                return Response({
                    'error': 'User account is disabled',
                    'source': 'simple_login'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            if hasattr(user, 'is_suspended') and user.is_suspended:
                return Response({
                    'error': 'User account is suspended',
                    'source': 'simple_login'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            if hasattr(user, 'is_approved') and not user.is_approved:
                return Response({
                    'error': 'User account is pending approval',
                    'source': 'simple_login'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            token, created = Token.objects.get_or_create(user=user)
            print(f"Token: {token.key[:10]}..., created: {created}")
            
            response_data = {
                'success': True,
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'full_name': getattr(user, 'full_name', ''),
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'message': 'Login successful',
                'source': 'simple_login'
            }
            print(f"Returning success response")
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            print("Authentication failed")
            return Response({
                'error': 'Invalid credentials',
                'source': 'simple_login'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        print(f"Error in simple login: {e}")
        return Response({
            'error': f'Server error: {str(e)}',
            'source': 'simple_login'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
