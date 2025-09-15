#!/usr/bin/env python3
"""
Railway Deployment Super Admin Setup Script
===========================================
This script ensures the super admin user exists with correct credentials
for the Railway PostgreSQL deployment.
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Setup Django
django.setup()

from accounts.models import User
from django.contrib.auth.hashers import make_password
from django.db import transaction

def setup_super_admin():
    """
    Create or update the super admin user for Railway deployment
    Credentials: tanzeem.agra@rugrel.com / Tanzilla@tanzeem786
    """
    try:
        with transaction.atomic():
            # Super admin configuration
            super_admin_config = {
                'email': 'tanzeem.agra@rugrel.com',
                'username': 'tanzeem_admin',
                'full_name': 'Tanzeem Agra - System Administrator',
                'password': 'Tanzilla@tanzeem786',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
                'is_approved': True,
                'department': 'Administration'
            }
            
            # Try to get existing user
            try:
                user = User.objects.get(email=super_admin_config['email'])
                print(f"✅ Found existing super admin: {user.email}")
                
                # Update user properties
                user.set_password(super_admin_config['password'])
                user.is_staff = super_admin_config['is_staff']
                user.is_superuser = super_admin_config['is_superuser']
                user.is_active = super_admin_config['is_active']
                user.is_approved = super_admin_config['is_approved']
                user.full_name = super_admin_config['full_name']
                user.department = super_admin_config['department']
                user.save()
                
                print(f"✅ Updated super admin user: {user.email}")
                
            except User.DoesNotExist:
                # Create new super admin user
                user = User.objects.create(
                    email=super_admin_config['email'],
                    username=super_admin_config['username'],
                    full_name=super_admin_config['full_name'],
                    department=super_admin_config['department'],
                    is_staff=super_admin_config['is_staff'],
                    is_superuser=super_admin_config['is_superuser'],
                    is_active=super_admin_config['is_active'],
                    is_approved=super_admin_config['is_approved']
                )
                user.set_password(super_admin_config['password'])
                user.save()
                
                print(f"✅ Created new super admin user: {user.email}")
            
            # Verify credentials
            from django.contrib.auth import authenticate
            auth_user = authenticate(
                email=super_admin_config['email'], 
                password=super_admin_config['password']
            )
            
            if auth_user:
                print(f"✅ Authentication test PASSED for {super_admin_config['email']}")
            else:
                print(f"❌ Authentication test FAILED for {super_admin_config['email']}")
            
            print("\n🔑 Super Admin Credentials:")
            print(f"   Email: {super_admin_config['email']}")
            print(f"   Password: {super_admin_config['password']}")
            print(f"   Login URL: https://www.rugrel.in/auth/sign-in")
            print(f"   API Endpoint: https://medixscan-production.up.railway.app/api")
            
            return True
            
    except Exception as e:
        print(f"❌ Error setting up super admin: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 Railway Super Admin Setup")
    print("=" * 40)
    
    success = setup_super_admin()
    
    if success:
        print("\n✅ Super admin setup completed successfully!")
        print("🌐 Ready for Railway deployment")
    else:
        print("\n❌ Super admin setup failed!")
        sys.exit(1)