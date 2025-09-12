#!/usr/bin/env python3
"""
Database User Cleanup Script
Lists all users and allows safe deletion of non-super admin users
"""

import os
import sys
import django
from datetime import datetime

# Add the project directory to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User, Role, UserRole
from django.db import models

def list_all_users():
    """List all users with their roles and details"""
    print("\n" + "="*80)
    print("CURRENT DATABASE USERS")
    print("="*80)
    
    users = User.objects.all().order_by('created_at')
    
    if not users.exists():
        print("No users found in database.")
        return []
    
    user_data = []
    for i, user in enumerate(users, 1):
        roles = list(user.roles.filter(is_active=True).values_list('name', flat=True))
        
        print(f"\n{i}. User ID: {user.id}")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Full Name: {user.full_name or 'Not set'}")
        print(f"   Roles: {', '.join(roles) if roles else 'No roles assigned'}")
        print(f"   Is Staff: {user.is_staff}")
        print(f"   Is Superuser: {user.is_superuser}")
        print(f"   Is Active: {user.is_active}")
        print(f"   Is Approved: {user.is_approved}")
        print(f"   Created: {user.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Check if this is the super admin
        is_super_admin = (
            user.is_superuser or 
            'SUPERUSER' in roles or 
            user.email == 'tanzeem.agra@rugrel.com'
        )
        
        if is_super_admin:
            print(f"   🔒 SUPER ADMIN - PROTECTED")
        else:
            print(f"   ❌ ELIGIBLE FOR DELETION")
        
        user_data.append({
            'user': user,
            'roles': roles,
            'is_super_admin': is_super_admin
        })
    
    return user_data

def delete_non_admin_users():
    """Delete all users except super admin"""
    print("\n" + "="*80)
    print("DELETING NON-ADMIN USERS")
    print("="*80)
    
    # Define super admin criteria
    super_admin_emails = ['tanzeem.agra@rugrel.com']
    
    # Get all users except super admins
    users_to_delete = User.objects.exclude(
        models.Q(is_superuser=True) |
        models.Q(email__in=super_admin_emails) |
        models.Q(roles__name='SUPERUSER')
    ).distinct()
    
    if not users_to_delete.exists():
        print("No non-admin users found to delete.")
        return
    
    print(f"Found {users_to_delete.count()} users to delete:")
    
    deleted_count = 0
    for user in users_to_delete:
        try:
            username = user.username
            email = user.email
            roles = list(user.roles.values_list('name', flat=True))
            
            print(f"Deleting: {username} ({email}) - Roles: {roles}")
            user.delete()
            deleted_count += 1
            
        except Exception as e:
            print(f"Error deleting user {user.username}: {str(e)}")
    
    print(f"\n✅ Successfully deleted {deleted_count} users")

def confirm_deletion():
    """Get user confirmation before deletion"""
    print("\n" + "⚠️ "*20)
    print("WARNING: This will permanently delete all non-admin users!")
    print("⚠️ "*20)
    
    response = input("\nType 'DELETE ALL USERS' to confirm deletion: ").strip()
    return response == 'DELETE ALL USERS'

def main():
    """Main function"""
    print("Database User Management Script")
    print("Current time:", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    try:
        # List all current users
        user_data = list_all_users()
        
        if not user_data:
            print("No users to process.")
            return
        
        # Count super admins and regular users
        super_admins = [u for u in user_data if u['is_super_admin']]
        regular_users = [u for u in user_data if not u['is_super_admin']]
        
        print(f"\n📊 SUMMARY:")
        print(f"   Total Users: {len(user_data)}")
        print(f"   Super Admins (Protected): {len(super_admins)}")
        print(f"   Regular Users (Will be deleted): {len(regular_users)}")
        
        if regular_users:
            print(f"\n🗑️  USERS TO BE DELETED:")
            for user_info in regular_users:
                user = user_info['user']
                print(f"   - {user.username} ({user.email})")
        
        if len(super_admins) == 0:
            print("\n❌ ERROR: No super admin found! This is dangerous.")
            print("Please ensure at least one super admin exists before running cleanup.")
            return
        
        if regular_users and confirm_deletion():
            delete_non_admin_users()
            
            # List users after deletion
            print(f"\n{'='*80}")
            print("USERS AFTER CLEANUP")
            print("="*80)
            list_all_users()
        else:
            print("\nDeletion cancelled.")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
