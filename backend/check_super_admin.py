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
try:
    from models import UserProfile
except ImportError:
    UserProfile = None

User = get_user_model()

def check_super_admin():
    print("=== Checking Super Admin User ===")
    
    try:
        # Check if admin@rugrel.in exists
        user = User.objects.filter(username='admin@rugrel.in').first()
        if user:
            print(f"✅ User 'admin@rugrel.in' found!")
            print(f"   ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Staff: {user.is_staff}")
            print(f"   Is Superuser: {user.is_superuser}")
            print(f"   Date Joined: {user.date_joined}")
            
            # Check if user has a profile
            if UserProfile:
                try:
                    profile = UserProfile.objects.get(user=user)
                    print(f"   Profile exists: Yes")
                    print(f"   Profile Role: {profile.role}")
                    print(f"   Profile Active: {profile.is_active}")
                    print(f"   Approval Status: {profile.approval_status}")
                except UserProfile.DoesNotExist:
                    print(f"   Profile exists: No")
            else:
                print(f"   Profile model not available")
                
        else:
            print("❌ User 'admin@rugrel.in' NOT found!")
            
        # Check all superuser accounts
        print("\n=== All Superuser Accounts ===")
        superusers = User.objects.filter(is_superuser=True)
        if superusers.exists():
            for su in superusers:
                print(f"✅ Superuser: {su.username} (Email: {su.email}, Active: {su.is_active})")
        else:
            print("❌ No superuser accounts found!")
            
        # Check all users
        print(f"\n=== Total Users in Database ===")
        total_users = User.objects.count()
        print(f"Total users: {total_users}")
        
        if total_users > 0:
            print("Recent users:")
            recent_users = User.objects.order_by('-date_joined')[:5]
            for user in recent_users:
                print(f"  - {user.username} ({user.email}) - {user.date_joined}")
                
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_super_admin()