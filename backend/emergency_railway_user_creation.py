#!/usr/bin/env python3

"""
Emergency Production User Creation Script
This script will be executed directly on Railway to create the super admin user
"""

import os
import sys
import django

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_emergency_super_admin():
    """
    Emergency creation of super admin user with multiple safety checks
    """
    print("=== EMERGENCY SUPER ADMIN CREATION ===")
    print("Creating admin@rugrel.in with enhanced safety checks...")
    
    try:
        # Delete any existing admin@rugrel.in user first
        existing_users = User.objects.filter(
            username__in=['admin@rugrel.in', 'admin'],
            email__in=['admin@rugrel.in', 'admin@rugrel.com']
        )
        
        if existing_users.exists():
            print(f"Found {existing_users.count()} existing admin users, deleting...")
            for user in existing_users:
                print(f"  Deleting: {user.username} ({user.email})")
                user.delete()
        
        # Create new super admin user
        print("Creating new super admin user...")
        
        # Method 1: Using create_superuser
        try:
            user = User.objects.create_superuser(
                username='admin@rugrel.in',
                email='admin@rugrel.in',
                password='Rugrel@321'
            )
            print(f"✅ Created user via create_superuser: ID {user.id}")
        except Exception as e:
            print(f"❌ create_superuser failed: {e}")
            
            # Method 2: Manual creation with explicit fields
            print("Trying manual user creation...")
            
            user = User(
                username='admin@rugrel.in',
                email='admin@rugrel.in',
                first_name='Admin',
                last_name='User',
                is_staff=True,
                is_superuser=True,
                is_active=True
            )
            user.password = make_password('Rugrel@321')
            user.save()
            print(f"✅ Created user manually: ID {user.id}")
        
        # Verify user creation
        print("\n=== VERIFICATION ===")
        
        # Test all possible lookup methods
        test_lookups = [
            ('email exact', User.objects.filter(email='admin@rugrel.in')),
            ('username exact', User.objects.filter(username='admin@rugrel.in')),
            ('email iexact', User.objects.filter(email__iexact='admin@rugrel.in')),
            ('username iexact', User.objects.filter(username__iexact='admin@rugrel.in')),
        ]
        
        for method, queryset in test_lookups:
            if queryset.exists():
                found_user = queryset.first()
                print(f"✅ Found user via {method}: {found_user.username} (ID: {found_user.id})")
            else:
                print(f"❌ NOT found via {method}")
        
        # Test authentication
        from django.contrib.auth import authenticate
        
        auth_methods = [
            ('username', 'admin@rugrel.in', 'Rugrel@321'),
            ('email as username', 'admin@rugrel.in', 'Rugrel@321'),
        ]
        
        for method, username, password in auth_methods:
            auth_user = authenticate(username=username, password=password)
            if auth_user:
                print(f"✅ Authentication successful via {method}")
            else:
                print(f"❌ Authentication failed via {method}")
        
        # Test direct password check
        if user.check_password('Rugrel@321'):
            print("✅ Direct password check works")
        else:
            print("❌ Direct password check failed")
        
        print(f"\n=== FINAL STATUS ===")
        print(f"User ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Active: {user.is_active}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Password Hash: {user.password[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Emergency creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = create_emergency_super_admin()
    
    if success:
        print("\n🎉 SUCCESS: Emergency super admin creation completed!")
        print("Credentials: admin@rugrel.in / Rugrel@321")
    else:
        print("\n💥 FAILED: Emergency super admin creation failed!")
        
    # Final user count
    total_users = User.objects.count()
    superusers = User.objects.filter(is_superuser=True).count()
    print(f"\nDatabase Status: {total_users} total users, {superusers} superusers")