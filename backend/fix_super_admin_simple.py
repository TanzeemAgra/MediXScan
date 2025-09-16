#!/usr/bin/env python3
"""
Fix Super Admin Account Status (Simple Version)
==============================================
Updates the super admin account to be active and approved
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from accounts.models import User

def fix_super_admin():
    """Fix super admin account status"""
    try:
        # Get the super admin user
        user = User.objects.get(email='tanzeem.agra@rugrel.com')
        
        print(f"Found user: {user.email}")
        print(f"Current status:")
        print(f"  - is_active: {user.is_active}")
        print(f"  - is_staff: {user.is_staff}")
        print(f"  - is_superuser: {user.is_superuser}")
        print(f"  - is_approved: {user.is_approved}")
        print(f"  - is_suspended: {user.is_suspended}")
        
        # Update user status
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.is_approved = True  # This was the missing piece!
        user.is_suspended = False
        user.save()
        
        print(f"\n✅ Updated user status:")
        print(f"  - is_active: {user.is_active}")
        print(f"  - is_staff: {user.is_staff}")
        print(f"  - is_superuser: {user.is_superuser}")
        print(f"  - is_approved: {user.is_approved}")
        print(f"  - is_suspended: {user.is_suspended}")
        
        print(f"\n🎉 Super admin account is now fully activated and approved!")
        print(f"   Email: {user.email}")
        print(f"   Password: Tanzilla@tanzeem786")
        print(f"   Login at: https://www.rugrel.in/auth/sign-in")
        
        return True
        
    except User.DoesNotExist:
        print(f"❌ Super admin user not found!")
        return False
    except Exception as e:
        print(f"❌ Error fixing super admin: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔧 Fixing Super Admin Account Status")
    print("=" * 50)
    
    success = fix_super_admin()
    
    if success:
        print(f"\n✅ Super admin account fixed successfully!")
        print(f"🔗 You can now login at: https://www.rugrel.in/auth/sign-in")
    else:
        print(f"\n❌ Failed to fix super admin account")