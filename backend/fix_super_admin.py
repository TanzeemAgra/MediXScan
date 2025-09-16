#!/usr/bin/env python3
"""
Fix Super Admin Account Status
=============================
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

from django.contrib.auth.models import User
from accounts.models import Profile

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
        
        # Update user status
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print(f"\n✅ Updated user status:")
        print(f"  - is_active: {user.is_active}")
        print(f"  - is_staff: {user.is_staff}")
        print(f"  - is_superuser: {user.is_superuser}")
        
        # Check and update profile if exists
        try:
            profile = Profile.objects.get(user=user)
            print(f"\nFound profile: {profile}")
            print(f"Current profile status:")
            print(f"  - status: {getattr(profile, 'status', 'No status field')}")
            print(f"  - is_approved: {getattr(profile, 'is_approved', 'No approval field')}")
            
            # Update profile status if it has these fields
            if hasattr(profile, 'status'):
                profile.status = 'active'
                
            if hasattr(profile, 'is_approved'):
                profile.is_approved = True
                
            if hasattr(profile, 'approval_status'):
                profile.approval_status = 'approved'
                
            profile.save()
            print(f"\n✅ Updated profile status")
            
        except Profile.DoesNotExist:
            print(f"\n⚠️ No profile found for user - creating one...")
            Profile.objects.create(
                user=user,
                status='active' if hasattr(Profile, 'status') else None,
                is_approved=True if hasattr(Profile, 'is_approved') else None
            )
            print(f"✅ Created profile for user")
            
        except Exception as e:
            print(f"⚠️ Profile update error: {e}")
        
        print(f"\n🎉 Super admin account is now fully activated!")
        print(f"   Email: {user.email}")
        print(f"   Password: Tanzilla@tanzeem786")
        print(f"   Login at: https://www.rugrel.in/auth/sign-in")
        
    except User.DoesNotExist:
        print(f"❌ Super admin user not found!")
        return False
    except Exception as e:
        print(f"❌ Error fixing super admin: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 Fixing Super Admin Account Status")
    print("=" * 50)
    
    success = fix_super_admin()
    
    if success:
        print(f"\n✅ Super admin account fixed successfully!")
        print(f"🔗 You can now login at: https://www.rugrel.in/auth/sign-in")
    else:
        print(f"\n❌ Failed to fix super admin account")