#!/usr/bin/env python3

import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set CORRECT production environment variables for Railway
# Using the external URL that works from outside Railway
os.environ['DATABASE_URL'] = 'postgresql://postgres:SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL@monorail.proxy.rlwy.net:22662/railway'
os.environ['DJANGO_SETTINGS_MODULE'] = 'medixscan_project.settings'

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_correct_super_admin():
    print("=== Creating Super Admin in CORRECT Production Database ===")
    print("Using Railway DATABASE_URL with correct password")
    
    try:
        # Check current users first
        print("\n=== Current Users in Production Database ===")
        users = User.objects.all()
        for user in users:
            print(f"  - {user.username} ({user.email}) - Superuser: {user.is_superuser}")
        
        # Check if admin@rugrel.in exists
        user = User.objects.filter(email='admin@rugrel.in').first()
        
        if user:
            print(f"\n✅ User admin@rugrel.in already exists with ID: {user.id}")
            print("Updating password and ensuring superuser status...")
            
            # Update password and ensure superuser
            user.set_password('Rugrel@321')
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            
            print("✅ User updated successfully!")
        else:
            print("\n❌ User admin@rugrel.in does NOT exist. Creating new user...")
            
            # Create new superuser
            user = User.objects.create_superuser(
                username='admin@rugrel.in',
                email='admin@rugrel.in',
                password='Rugrel@321'
            )
            user.is_active = True
            user.save()
            
            print(f"✅ Super admin created successfully with ID: {user.id}")
        
        # Test authentication
        print("\n=== Testing Authentication ===")
        from django.contrib.auth import authenticate
        
        auth_user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
        if auth_user:
            print("✅ Authentication test PASSED!")
            print(f"   User: {auth_user.username}")
            print(f"   Email: {auth_user.email}")
            print(f"   Is Superuser: {auth_user.is_superuser}")
            print(f"   Is Active: {auth_user.is_active}")
        else:
            print("❌ Authentication test FAILED!")
            
            # Check password directly
            final_user = User.objects.get(email='admin@rugrel.in')
            if final_user.check_password('Rugrel@321'):
                print("   ✅ Password check works")
            else:
                print("   ❌ Password check failed")
        
        print("\n=== Final User Count ===")
        total_users = User.objects.count()
        superusers = User.objects.filter(is_superuser=True).count()
        print(f"Total users: {total_users}")
        print(f"Superusers: {superusers}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_correct_super_admin()