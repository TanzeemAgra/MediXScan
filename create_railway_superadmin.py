#!/usr/bin/env python3
"""
Railway Super Admin Creation Script
Purpose: Create admin@rugrel.in super admin on Railway production database
"""

import subprocess
import sys
import os

def create_railway_superadmin():
    """Create super admin using Railway CLI"""
    print("🚀 Creating Rugrel Super Admin on Railway Production Database")
    print("=" * 60)
    
    # Create Django management command for Railway
    django_command = '''
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "medixscan_project.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

# User details
email = "admin@rugrel.in"
username = "admin@rugrel.in" 
password = "Rugrel@321"
first_name = "Rugrel"
last_name = "Admin"

try:
    # Check if user exists
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        print(f"User exists: {user.email}")
    else:
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        print(f"Created user: {user.email}")
    
    # Set superuser privileges
    user.is_superuser = True
    user.is_staff = True
    user.is_active = True
    user.save()
    
    # Add to admin group
    admin_group, created = Group.objects.get_or_create(name="Administrators")
    user.groups.add(admin_group)
    
    print(f"SUCCESS: Super admin {email} created/updated")
    print(f"Superuser: {user.is_superuser}")
    print(f"Staff: {user.is_staff}")
    print(f"Active: {user.is_active}")
    
except Exception as e:
    print(f"ERROR: {e}")
    '''
    
    # Write the command to a temporary file
    with open('temp_create_admin.py', 'w') as f:
        f.write(django_command)
    
    try:
        # Run the command on Railway
        print("📡 Connecting to Railway production database...")
        result = subprocess.run([
            'railway', 'run', 'python', 'temp_create_admin.py'
        ], capture_output=True, text=True, cwd='d:/radiology_v2')
        
        print("📋 Railway Command Output:")
        print("-" * 40)
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        print("-" * 40)
        
        if result.returncode == 0:
            print("✅ Railway super admin creation completed!")
        else:
            print(f"❌ Railway command failed with exit code: {result.returncode}")
            
    except Exception as e:
        print(f"❌ Error running Railway command: {e}")
    
    finally:
        # Clean up temporary file
        if os.path.exists('temp_create_admin.py'):
            os.remove('temp_create_admin.py')
            print("🧹 Cleaned up temporary files")

def main():
    print("🌐 RAILWAY PRODUCTION SUPER ADMIN SETUP")
    print("👤 Creating: admin@rugrel.in")
    print("🔐 Password: Rugrel@321")
    print("=" * 60)
    
    create_railway_superadmin()
    
    print("\n" + "=" * 60)
    print("✅ RAILWAY SUPER ADMIN SETUP COMPLETE!")
    print("🔗 Login at: https://www.rugrel.in")
    print("⚙️  Admin Panel: https://medixscan-production.up.railway.app/admin/")
    print("=" * 60)

if __name__ == '__main__':
    main()