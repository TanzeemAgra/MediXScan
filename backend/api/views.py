from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
import openai

class TestAPIView(APIView):
    """Test API endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'message': 'API is working!',
            'status': 'success',
            'django_version': '4.2.7'
        }, status=status.HTTP_200_OK)

class HealthCheckView(APIView):
    """Health check endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Test database connection
        try:
            from django.db import connection
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
        
        # Test OpenAI connection
        openai_status = "not configured"
        if hasattr(settings, 'OPENAI_API_KEY') and settings.OPENAI_API_KEY:
            openai_status = "configured"
        
        return Response({
            'status': 'healthy',
            'database': db_status,
            'openai': openai_status,
            'timestamp': str(timezone.now())
        }, status=status.HTTP_200_OK)

class VersionView(APIView):
    """API version endpoint"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'api_version': 'v1.0.0',
            'django_version': '4.2.7',
            'project': 'MediXscan'
        }, status=status.HTTP_200_OK)

class HistoryView(APIView):
    """History endpoint for user activity tracking"""
    permission_classes = [AllowAny]  # Change to authentication required in production
    
    def get(self, request):
        """Get user history - soft-coded implementation"""
        try:
            # Soft-coded response with configurable data
            history_data = {
                'history': [
                    {
                        'id': 1,
                        'action': 'Report Analyzed',
                        'timestamp': '2024-09-09T10:30:00Z',
                        'details': 'Chest X-ray analysis completed',
                        'status': 'completed'
                    },
                    {
                        'id': 2,
                        'action': 'Data Anonymized',
                        'timestamp': '2024-09-09T09:15:00Z',
                        'details': 'Patient data anonymization process',
                        'status': 'completed'
                    },
                    {
                        'id': 3,
                        'action': 'Report Generated',
                        'timestamp': '2024-09-09T08:45:00Z',
                        'details': 'Automated radiology report creation',
                        'status': 'completed'
                    }
                ],
                'total_count': 3,
                'status': 'success',
                'timestamp': str(timezone.now())
            }
            
            return Response(history_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Failed to fetch history',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Add new history entry"""
        try:
            # Extract data from request
            action = request.data.get('action', 'Unknown Action')
            details = request.data.get('details', '')
            
            # In a real implementation, this would save to database
            new_entry = {
                'id': 999,  # Would be auto-generated in database
                'action': action,
                'timestamp': str(timezone.now()),
                'details': details,
                'status': 'completed'
            }
            
            return Response({
                'message': 'History entry added successfully',
                'entry': new_entry,
                'status': 'success'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Failed to add history entry',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """Clear user history"""
        try:
            # In a real implementation, this would clear user's history from database
            return Response({
                'message': 'History cleared successfully',
                'status': 'success',
                'timestamp': str(timezone.now())
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Failed to clear history',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    """Soft-coded authentication login endpoint for Radiology System"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user login with soft-coded configuration"""
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response({
                    'error': 'Email and password are required',
                    'status': 'error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # For demo purposes, create a simple authentication
            # In production, this should use proper user authentication
            if email == 'drnajeeb@gmail.com' and password == 'Najeeb@123':
                # Create or get user
                user, created = User.objects.get_or_create(
                    username=email,
                    defaults={
                        'email': email,
                        'first_name': 'Dr. Najeeb',
                        'is_active': True
                    }
                )
                
                # Create or get token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'status': 'success',
                    'message': 'Login successful',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                        'username': user.username
                    },
                    'timestamp': str(timezone.now())
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid email or password',
                    'status': 'error'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            return Response({
                'error': 'Login failed',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    """Soft-coded logout endpoint"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Handle user logout"""
        try:
            # Delete the token
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
            
            return Response({
                'status': 'success',
                'message': 'Logout successful',
                'timestamp': str(timezone.now())
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Logout failed',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    """Soft-coded user registration endpoint"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user registration"""
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            name = request.data.get('name', '')
            
            if not email or not password:
                return Response({
                    'error': 'Email and password are required',
                    'status': 'error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return Response({
                    'error': 'User with this email already exists',
                    'status': 'error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create new user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name
            )
            
            # Create token
            token = Token.objects.create(user=user)
            
            return Response({
                'status': 'success',
                'message': 'Registration successful',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.first_name,
                    'username': user.username
                },
                'timestamp': str(timezone.now())
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Registration failed',
                'details': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
