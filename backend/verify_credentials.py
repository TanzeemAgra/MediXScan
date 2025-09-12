#!/usr/bin/env python
"""
Script to verify the super admin user credentials
"""
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Setup Django
django.setup()

from accounts.models import User
from django.contrib.auth import authenticate

def verify_credentials():
    """Verify the super admin user credentials."""
    
    try:
        email = 'tanzeem.agra@rugrel.com'
        password = 'Tanzilla@tanzeem786'
        
        print(f"🔍 Verifying credentials for: {email}")
        print("=" * 50)
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
            print(f"✅ User found: {user.email}")
            print(f"   Username: {user.username}")
            print(f"   is_superuser: {user.is_superuser}")
            print(f"   is_staff: {user.is_staff}")
            print(f"   is_active: {user.is_active}")
            print(f"   is_approved: {getattr(user, 'is_approved', 'N/A')}")
        except User.DoesNotExist:
            print("❌ User not found!")
            return False
        
        # Test password authentication
        print(f"\n🔑 Testing password authentication...")
        
        # Method 1: Direct password check
        password_valid = user.check_password(password)
        print(f"   Direct check_password(): {password_valid}")
        
        # Method 2: Django authenticate function
        auth_user = authenticate(username=email, password=password)
        print(f"   Django authenticate(): {auth_user is not None}")
        
        if auth_user:
            print(f"   Authenticated user: {auth_user.email}")
        
        # Method 3: Try with username instead of email
        auth_user_username = authenticate(username=user.username, password=password)
        print(f"   Authenticate with username: {auth_user_username is not None}")
        
        return password_valid and auth_user is not None
        
    except Exception as e:
        print(f"❌ Error verifying credentials: {e}")
        return False

if __name__ == '__main__':
    print("🔧 Verifying Super Admin Credentials...")
    print("=" * 50)
    
    success = verify_credentials()
    
    if success:
        print("\n🎉 Credentials are valid!")
    else:
        print("\n❌ Credentials verification failed!")
        sys.exit(1)
