#!/usr/bin/env python3
"""
Railway Super Admin Account Approval Script
==========================================
This script directly updates the Railway database to approve the super admin
"""

import os
import sys
import django
from pathlib import Path

# Ensure we're in the right directory
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Setup Django
django.setup()

from accounts.models import User
from django.db import transaction

def approve_super_admin():
    """Approve the super admin account on Railway"""
    try:
        with transaction.atomic():
            # Get the super admin user
            user = User.objects.get(email='tanzeem.agra@rugrel.com')
            
            print(f"🔍 Found user: {user.email}")
            print(f"Current status:")
            print(f"  - is_active: {user.is_active}")
            print(f"  - is_staff: {user.is_staff}")
            print(f"  - is_superuser: {user.is_superuser}")
            print(f"  - is_approved: {user.is_approved}")
            print(f"  - is_suspended: {user.is_suspended}")
            
            # Force update all status fields
            user.is_active = True
            user.is_staff = True
            user.is_superuser = True
            user.is_approved = True
            user.is_suspended = False
            
            # Ensure password is set correctly
            user.set_password('Tanzilla@tanzeem786')
            user.save()
            
            print(f"\n✅ Updated user status:")
            print(f"  - is_active: {user.is_active}")
            print(f"  - is_staff: {user.is_staff}")
            print(f"  - is_superuser: {user.is_superuser}")
            print(f"  - is_approved: {user.is_approved}")
            print(f"  - is_suspended: {user.is_suspended}")
            
            # Test authentication
            from django.contrib.auth import authenticate
            auth_user = authenticate(email='tanzeem.agra@rugrel.com', password='Tanzilla@tanzeem786')
            
            if auth_user and auth_user.is_approved:
                print(f"\n🎉 SUCCESS: Super admin is now fully approved and can login!")
                print(f"   Email: tanzeem.agra@rugrel.com")
                print(f"   Password: Tanzilla@tanzeem786")
                return True
            else:
                print(f"\n❌ Authentication test failed - user might still be pending")
                return False
                
    except User.DoesNotExist:
        print(f"❌ Super admin user not found!")
        return False
    except Exception as e:
        print(f"❌ Error approving super admin: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 Railway Super Admin Approval")
    print("=" * 40)
    
    success = approve_super_admin()
    
    if success:
        print(f"\n✅ Super admin approved successfully!")
        print(f"🔗 Login at: https://www.rugrel.in/auth/sign-in")
    else:
        print(f"\n❌ Failed to approve super admin!")