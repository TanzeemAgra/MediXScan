#!/usr/bin/env python3

import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set production environment variables for Railway
os.environ['DATABASE_URL'] = 'postgresql://postgres:SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL@postgres.railway.internal:5432/railway'
os.environ['DJANGO_SETTINGS_MODULE'] = 'medixscan_project.settings'

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def check_railway_super_admin():
    print("=== Checking Railway Production Database ===")
    
    try:
        # Check if admin@rugrel.in exists
        user = User.objects.filter(username='admin@rugrel.in').first()
        if user:
            print(f"✅ User 'admin@rugrel.in' found in Railway database!")
            print(f"   ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Staff: {user.is_staff}")
            print(f"   Is Superuser: {user.is_superuser}")
            print(f"   Date Joined: {user.date_joined}")
        else:
            print("❌ User 'admin@rugrel.in' NOT found in Railway database!")
            
        # Check all superuser accounts
        print("\n=== All Superuser Accounts in Railway ===")
        superusers = User.objects.filter(is_superuser=True)
        if superusers.exists():
            for su in superusers:
                print(f"✅ Superuser: {su.username} (Email: {su.email}, Active: {su.is_active})")
        else:
            print("❌ No superuser accounts found in Railway!")
            
        # Check total users in Railway
        print(f"\n=== Total Users in Railway Database ===")
        total_users = User.objects.count()
        print(f"Total users: {total_users}")
        
        if total_users > 0:
            print("All users:")
            all_users = User.objects.all()
            for user in all_users:
                print(f"  - {user.username} ({user.email}) - Superuser: {user.is_superuser}")
                
    except Exception as e:
        print(f"❌ Error checking Railway database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_railway_super_admin()