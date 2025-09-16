#!/usr/bin/env python3

import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def diagnose_user_fields():
    print("=== USER FIELD DIAGNOSIS ===")
    
    try:
        # Check the user by different field lookups
        print("1. Looking up by username='admin@rugrel.in':")
        user_by_username = User.objects.filter(username='admin@rugrel.in').first()
        if user_by_username:
            print(f"   ✅ Found by username")
            print(f"   Username: '{user_by_username.username}'")
            print(f"   Email: '{user_by_username.email}'")
            print(f"   ID: {user_by_username.id}")
        else:
            print("   ❌ Not found by username")
            
        print("\n2. Looking up by email='admin@rugrel.in':")
        user_by_email = User.objects.filter(email='admin@rugrel.in').first()
        if user_by_email:
            print(f"   ✅ Found by email")
            print(f"   Username: '{user_by_email.username}'")
            print(f"   Email: '{user_by_email.email}'")
            print(f"   ID: {user_by_email.id}")
        else:
            print("   ❌ Not found by email")
            
        # Check all users to see field patterns
        print("\n3. All users in database:")
        all_users = User.objects.all()
        for user in all_users:
            print(f"   ID: {user.id} | Username: '{user.username}' | Email: '{user.email}'")
            
        # Check if there are any users with empty email but username set
        print("\n4. Users with empty email fields:")
        empty_email_users = User.objects.filter(email='')
        for user in empty_email_users:
            print(f"   Username: '{user.username}' | Email: '{user.email}' (empty)")
            
        # Check if there are case sensitivity issues
        print("\n5. Case insensitive lookup test:")
        case_test = User.objects.filter(email__iexact='admin@rugrel.in').first()
        if case_test:
            print(f"   ✅ Found with case insensitive: {case_test.username}")
        else:
            print(f"   ❌ Not found with case insensitive")
            
    except Exception as e:
        print(f"❌ Error in diagnosis: {e}")
        import traceback
        traceback.print_exc()

def test_railway_fields():
    print("\n=== RAILWAY DATABASE FIELD CHECK ===")
    
    try:
        # Set Railway database
        railway_db_url = "postgresql://postgres:VHNnfKPZAVqYJqSaJRFrVmfYnFyuJrAk@monorail.proxy.rlwy.net:22662/railway"
        original_db_url = os.environ.get('DATABASE_URL')
        os.environ['DATABASE_URL'] = railway_db_url
        
        # Re-setup Django
        from django.apps import apps
        apps.clear_cache()
        django.setup()
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        print("1. Railway - Looking up by email='admin@rugrel.in':")
        user_by_email = User.objects.filter(email='admin@rugrel.in').first()
        if user_by_email:
            print(f"   ✅ Found by email in Railway")
            print(f"   Username: '{user_by_email.username}'")
            print(f"   Email: '{user_by_email.email}'")
        else:
            print("   ❌ Not found by email in Railway")
            
        print("\n2. Railway - All users:")
        all_users = User.objects.all()
        for user in all_users:
            print(f"   Username: '{user.username}' | Email: '{user.email}'")
            
    except Exception as e:
        print(f"❌ Railway field check failed: {e}")
    finally:
        # Restore original database
        if original_db_url:
            os.environ['DATABASE_URL'] = original_db_url
        else:
            os.environ.pop('DATABASE_URL', None)

if __name__ == "__main__":
    diagnose_user_fields()
    test_railway_fields()