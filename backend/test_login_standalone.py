import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

def test_login():
    """Test the login functionality directly"""
    email = "drnajeeb@gmail.com"
    password = "Najeeb@123"
    
    print(f"Testing authentication for: {email}")
    
    # Try authentication
    user = authenticate(username=email, password=password)
    print(f"Authentication result: {user}")
    
    if user:
        try:
            # Try to create/get token
            token, created = Token.objects.get_or_create(user=user)
            print(f"Token creation successful: {token.key}, created: {created}")
            
            return {
                'success': True,
                'token': token.key,
                'user_email': user.email,
                'user_id': user.id
            }
        except Exception as e:
            print(f"Token creation failed: {e}")
            return {'success': False, 'error': f'Token creation failed: {e}'}
    else:
        print("Authentication failed")
        return {'success': False, 'error': 'Authentication failed'}

if __name__ == "__main__":
    result = test_login()
    print(f"Final result: {result}")
