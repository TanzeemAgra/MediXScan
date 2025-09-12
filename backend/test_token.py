import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

try:
    from rest_framework.authtoken.models import Token
    print(f"Token class: {Token}")
    print(f"Token has objects: {hasattr(Token, 'objects')}")
    print(f"Token objects: {Token.objects}")
    print("Token import successful!")
except Exception as e:
    print(f"Error importing Token: {e}")
    
try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    print(f"User model: {User}")
    
    # Try to get a user
    user = User.objects.first()
    print(f"First user: {user}")
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        print(f"Token creation successful: {token}, created: {created}")
    
except Exception as e:
    print(f"Error with token creation: {e}")
