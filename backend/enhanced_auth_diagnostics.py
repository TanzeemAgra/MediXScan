"""
Soft-coded authentication enhancement for production reliability
Handles multiple authentication scenarios and user lookup methods
"""

import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model, authenticate
from django.db.models import Q

User = get_user_model()

def enhanced_user_lookup(email_or_username):
    """
    Soft-coded user lookup that tries multiple methods
    Returns user object or None
    """
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
            
        # Method 3: Case-insensitive email lookup
        user = User.objects.filter(email__iexact=email_or_username).first()
        if user:
            print(f"✅ Found user by case-insensitive email: {user.username}")
            return user
            
        # Method 4: Case-insensitive username lookup
        user = User.objects.filter(username__iexact=email_or_username).first()
        if user:
            print(f"✅ Found user by case-insensitive username: {user.username}")
            return user
            
        # Method 5: Combined Q lookup
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

def enhanced_authentication(email_or_username, password):
    """
    Soft-coded authentication that tries multiple methods
    Returns authenticated user or None
    """
    try:
        # First find the user
        user = enhanced_user_lookup(email_or_username)
        if not user:
            print(f"❌ No user found for: {email_or_username}")
            return None
        
        print(f"🔍 Testing authentication for user: {user.username} (email: {user.email})")
        
        # Method 1: Authenticate with username
        auth_user = authenticate(username=user.username, password=password)
        if auth_user:
            print(f"✅ Authentication successful with username: {user.username}")
            return auth_user
        
        # Method 2: Authenticate with email
        auth_user = authenticate(username=user.email, password=password)
        if auth_user:
            print(f"✅ Authentication successful with email: {user.email}")
            return auth_user
        
        # Method 3: Direct password check
        if user.check_password(password):
            print(f"✅ Direct password check successful")
            return user
        
        print(f"❌ All authentication methods failed for user: {user.username}")
        return None
        
    except Exception as e:
        print(f"❌ Error in authentication: {e}")
        return None

def test_enhanced_authentication():
    """Test the enhanced authentication with our credentials"""
    print("=== Testing Enhanced Authentication ===")
    
    test_credentials = [
        ('admin@rugrel.in', 'Rugrel@321'),
        ('tanzeem.agra@rugrel.com', 'StrongPassword123!')
    ]
    
    for email, password in test_credentials:
        print(f"\n--- Testing {email} ---")
        
        # Test user lookup
        user = enhanced_user_lookup(email)
        if user:
            print(f"User found: {user.username} (ID: {user.id})")
            print(f"Email: {user.email}")
            print(f"Is active: {user.is_active}")
            print(f"Is superuser: {user.is_superuser}")
            print(f"Password hash: {user.password[:50]}...")
        else:
            print("❌ User not found")
            continue
        
        # Test authentication
        auth_user = enhanced_authentication(email, password)
        if auth_user:
            print(f"✅ Authentication SUCCESSFUL for {email}")
        else:
            print(f"❌ Authentication FAILED for {email}")

def create_enhanced_login_view():
    """Create an enhanced login view with soft-coded authentication"""
    
    enhanced_login_code = '''
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
'''
    
    print("=== Enhanced Login View Code ===")
    print(enhanced_login_code)
    
    # Write to file
    with open('enhanced_login_view.py', 'w') as f:
        f.write(enhanced_login_code)
    
    print("✅ Enhanced login view code saved to enhanced_login_view.py")

if __name__ == "__main__":
    test_enhanced_authentication()
    create_enhanced_login_view()