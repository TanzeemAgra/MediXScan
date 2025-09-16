
# Enhanced Login View with Soft-coded Authentication
# Add this to accounts/views.py

from django.db.models import Q

class EnhancedLoginView(APIView):
    """Soft-coded login endpoint with robust user lookup and authentication"""
    permission_classes = [AllowAny]
    
    def enhanced_user_lookup(self, email_or_username):
        """Soft-coded user lookup that tries multiple methods"""
        try:
            # Try multiple lookup methods
            user = User.objects.filter(
                Q(email__iexact=email_or_username) | 
                Q(username__iexact=email_or_username)
            ).first()
            return user
        except Exception as e:
            print(f"Error in user lookup: {e}")
            return None
    
    def enhanced_authentication(self, user, password):
        """Soft-coded authentication with multiple methods"""
        try:
            # Method 1: Standard Django authentication with username
            auth_user = authenticate(username=user.username, password=password)
            if auth_user:
                return auth_user
            
            # Method 2: Authentication with email as username
            auth_user = authenticate(username=user.email, password=password)
            if auth_user:
                return auth_user
            
            # Method 3: Direct password verification
            if user.check_password(password):
                return user
                
            return None
        except Exception as e:
            print(f"Error in authentication: {e}")
            return None
    
    def post(self, request):
        print("=== ENHANCED LOGIN VIEW CALLED ===")
        
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response({
                    'error': 'Email and password required',
                    'debug': 'ENHANCED_LOGIN_VIEW'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enhanced user lookup
            user = self.enhanced_user_lookup(email)
            if not user:
                return Response({
                    'error': 'User not found',
                    'debug': 'ENHANCED_USER_LOOKUP_FAILED'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enhanced authentication
            authenticated_user = self.enhanced_authentication(user, password)
            if not authenticated_user:
                return Response({
                    'error': 'Invalid credentials',
                    'debug': 'ENHANCED_AUTHENTICATION_FAILED'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Standard checks
            if not authenticated_user.is_active:
                return Response({
                    'error': 'Account disabled'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate token
            token, created = Token.objects.get_or_create(user=authenticated_user)
            
            return Response({
                'access_token': token.key,
                'user': {
                    'id': authenticated_user.id,
                    'username': authenticated_user.username,
                    'email': authenticated_user.email,
                    'is_superuser': authenticated_user.is_superuser
                },
                'message': 'Enhanced login successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Login system error',
                'debug': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
