#!/usr/bin/env python
"""
Script to update the super admin user credentials
"""
import os
import sys
import django

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Setup Django
django.setup()

from accounts.models import User, Role
from django.contrib.auth.hashers import make_password

def update_super_admin():
    """Update the super admin user with the required credentials."""
    
    try:
        # Find the existing super admin user
        user = User.objects.get(email='tanzeem.agra@rugrel.com')
        print(f"Found existing user: {user.email}")
        
        # Update the password
        user.set_password('Tanzilla@tanzeem786')
        
        # Ensure the user has all required properties
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.is_approved = True
        
        # Update profile information
        user.full_name = 'Tanzeem Agra'
        user.department = 'Administration'
        user.employee_id = 'SA001'
        user.phone_number = '+1-555-0100'
        
        # Save the user
        user.save()
        
        print("✅ Super admin user updated successfully!")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   is_superuser: {user.is_superuser}")
        print(f"   is_staff: {user.is_staff}")
        print(f"   is_active: {user.is_active}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Department: {user.department}")
        
        # Check if user has super admin role
        try:
            superuser_role, created = Role.objects.get_or_create(
                name='SUPERUSER',
                defaults={
                    'display_name': 'Super User',
                    'description': 'Full system access and administration privileges'
                }
            )
            
            # Add role to user if not already present
            if not user.has_role('SUPERUSER'):
                from accounts.models import UserRole
                UserRole.objects.get_or_create(user=user, role=superuser_role)
                print("✅ Super User role assigned to user")
            else:
                print("✅ User already has Super User role")
                
        except Exception as e:
            print(f"⚠️  Warning: Could not assign role: {e}")
        
        return True
        
    except User.DoesNotExist:
        print("❌ User tanzeem.agra@rugrel.com not found!")
        print("Creating new super admin user...")
        
        # Create new super admin user
        user = User.objects.create_superuser(
            email='tanzeem.agra@rugrel.com',
            username='superuser',
            password='Tanzilla@tanzeem786',
            full_name='Tanzeem Agra',
            department='Administration',
            employee_id='SA001',
            phone_number='+1-555-0100',
            is_approved=True
        )
        
        print("✅ New super admin user created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error updating user: {e}")
        return False

if __name__ == '__main__':
    print("🔧 Updating Super Admin User...")
    print("=" * 50)
    
    success = update_super_admin()
    
    if success:
        print("\n🎉 Operation completed successfully!")
        print("You can now login with:")
        print("   Email: tanzeem.agra@rugrel.com")
        print("   Password: Tanzilla@tanzeem786")
    else:
        print("\n❌ Operation failed!")
        sys.exit(1)
