#!/usr/bin/env python3

import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# CORRECT Production Database URL from Railway
PRODUCTION_DATABASE_URL = "postgresql://postgres:SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL@postgres.railway.internal:5432/railway"

# Set the correct production database
os.environ['DATABASE_URL'] = PRODUCTION_DATABASE_URL
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_production_super_admin():
    print("=== CREATING SUPER ADMIN IN CORRECT PRODUCTION DATABASE ===")
    print(f"Database URL: {PRODUCTION_DATABASE_URL}")
    
    try:
        # Check if user already exists
        existing_user = User.objects.filter(username='admin@rugrel.in').first()
        if existing_user:
            print(f"✅ User already exists: {existing_user.username}")
            print(f"   Email: {existing_user.email}")
            print(f"   Is Active: {existing_user.is_active}")
            print(f"   Is Staff: {existing_user.is_staff}")
            print(f"   Is Superuser: {existing_user.is_superuser}")
            
            # Update password to be sure
            existing_user.set_password('Rugrel@321')
            existing_user.is_active = True
            existing_user.is_staff = True
            existing_user.is_superuser = True
            existing_user.save()
            
            print("✅ User updated with correct password and permissions!")
            return existing_user
        else:
            print("❌ User does not exist in production database, creating...")
            
            # Create new super admin user
            user = User.objects.create(
                username='admin@rugrel.in',
                email='admin@rugrel.in',
                first_name='Admin',
                last_name='Rugrel',
                is_active=True,
                is_staff=True,
                is_superuser=True
            )
            user.set_password('Rugrel@321')
            user.save()
            
            print(f"✅ Super admin created successfully!")
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   ID: {user.id}")
            return user
            
    except Exception as e:
        print(f"❌ Error creating super admin: {e}")
        import traceback
        traceback.print_exc()
        return None

def verify_production_login():
    print("\n=== VERIFYING PRODUCTION LOGIN ===")
    
    try:
        from django.contrib.auth import authenticate
        
        # Test authentication
        user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
        if user:
            print("✅ Authentication successful!")
            print(f"   User: {user.username}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Superuser: {user.is_superuser}")
            return True
        else:
            print("❌ Authentication failed!")
            
            # Check if user exists but password is wrong
            user_obj = User.objects.filter(username='admin@rugrel.in').first()
            if user_obj:
                print(f"   User exists but password check failed")
                if user_obj.check_password('Rugrel@321'):
                    print("   ✅ Password check_password() works")
                else:
                    print("   ❌ Password check_password() failed")
            return False
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

def list_all_production_users():
    print("\n=== ALL USERS IN PRODUCTION DATABASE ===")
    
    try:
        all_users = User.objects.all()
        print(f"Total users: {all_users.count()}")
        
        for user in all_users:
            print(f"  - Username: '{user.username}' | Email: '{user.email}' | Superuser: {user.is_superuser}")
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")

def main():
    print("🔧 PRODUCTION DATABASE SUPER ADMIN CREATION")
    print("=" * 60)
    
    # List current users
    list_all_production_users()
    
    # Create/update super admin
    user = create_production_super_admin()
    
    if user:
        # Verify login works
        login_success = verify_production_login()
        
        if login_success:
            print("\n🎉 SUCCESS! Super admin is ready for production login!")
            print(f"🔐 Credentials: admin@rugrel.in / Rugrel@321")
        else:
            print("\n❌ Super admin created but login verification failed!")
    
    # Final user list
    list_all_production_users()

if __name__ == "__main__":
    main()