#!/usr/bin/env python
"""
EMERGENCY FIX: Create or update admin@rugrel.in user in Railway production database
"""

import os
import sys
import django
from django.conf import settings

# Add the backend directory to Python path
sys.path.insert(0, '/opt/render/project/src/backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_or_update_rugrel_admin():
    """Create or update the admin@rugrel.in user with correct password"""
    
    email = 'admin@rugrel.in'
    password = 'Rugrel@321'
    
    print(f"🚨 EMERGENCY: Creating/updating user {email}")
    
    try:
        # Try to get existing user first
        user = User.objects.get(email=email)
        print(f"✅ User {email} exists - updating password")
        
        # Update password
        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print(f"✅ Updated user {email}")
        
    except User.DoesNotExist:
        print(f"❌ User {email} not found - creating new user")
        
        # Create new user
        user = User.objects.create(
            email=email,
            username=email,
            password=make_password(password),
            is_active=True,
            is_staff=True,
            is_superuser=True,
            first_name='Rugrel',
            last_name='Admin'
        )
        
        print(f"✅ Created new user {email}")
    
    # Verify password works
    from django.contrib.auth import authenticate
    auth_user = authenticate(username=email, password=password)
    
    if auth_user:
        print(f"✅ Password verification successful for {email}")
        return True
    else:
        print(f"❌ Password verification failed for {email}")
        return False

if __name__ == '__main__':
    success = create_or_update_rugrel_admin()
    if success:
        print("🎉 EMERGENCY FIX COMPLETE: admin@rugrel.in is ready")
        sys.exit(0)
    else:
        print("❌ EMERGENCY FIX FAILED: Password verification failed")
        sys.exit(1)