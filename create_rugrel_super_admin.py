#!/usr/bin/env python3
"""
Create Super Admin User for Rugrel
Username: admin@rugrel.in
Password: Rugrel@321
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('d:/radiology_v2/backend')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Setup Django
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

def create_rugrel_super_admin():
    """Create super admin user for Rugrel with specified credentials"""
    
    print("🔧 Creating Rugrel Super Admin User...")
    print("=" * 50)
    
    # Admin credentials
    username = "admin@rugrel.in"
    email = "admin@rugrel.in"
    password = "Rugrel@321"
    
    try:
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"⚠️  User with username '{username}' already exists")
            existing_user = User.objects.get(username=username)
            
            # Update existing user to ensure super admin privileges
            existing_user.is_staff = True
            existing_user.is_superuser = True
            existing_user.is_active = True
            existing_user.set_password(password)  # Update password
            existing_user.save()
            
            print("✅ Updated existing user with super admin privileges")
            print(f"👤 Username: {existing_user.username}")
            print(f"📧 Email: {existing_user.email}")
            print(f"⭐ Is superuser: {existing_user.is_superuser}")
            print(f"🛡️ Is staff: {existing_user.is_staff}")
            print(f"✅ Is active: {existing_user.is_active}")
            
            return existing_user
        
        # Check if email is already used
        if User.objects.filter(email=email).exists():
            print(f"⚠️  User with email '{email}' already exists")
            existing_user = User.objects.get(email=email)
            
            # Update username and privileges
            existing_user.username = username
            existing_user.is_staff = True
            existing_user.is_superuser = True
            existing_user.is_active = True
            existing_user.set_password(password)
            existing_user.save()
            
            print("✅ Updated existing user with new username and super admin privileges")
            print(f"👤 Username: {existing_user.username}")
            print(f"📧 Email: {existing_user.email}")
            print(f"⭐ Is superuser: {existing_user.is_superuser}")
            print(f"🛡️ Is staff: {existing_user.is_staff}")
            print(f"✅ Is active: {existing_user.is_active}")
            
            return existing_user
        
        # Validate password strength
        try:
            validate_password(password)
            print("✅ Password validation passed")
        except ValidationError as e:
            print(f"⚠️  Password validation warnings: {e}")
            print("🔄 Proceeding anyway...")
        
        # Create new super admin user
        super_admin = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Rugrel',
            last_name='Admin',
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        
        print("✅ Rugrel Super Admin user created successfully!")
        print()
        print("📋 USER DETAILS:")
        print("=" * 30)
        print(f"👤 Username: {super_admin.username}")
        print(f"📧 Email: {super_admin.email}")
        print(f"🔑 Password: {password}")
        print(f"👨‍💼 Full Name: {super_admin.first_name} {super_admin.last_name}")
        print(f"⭐ Is superuser: {super_admin.is_superuser}")
        print(f"🛡️ Is staff: {super_admin.is_staff}")
        print(f"✅ Is active: {super_admin.is_active}")
        print(f"📅 Date created: {super_admin.date_joined}")
        print()
        
        # Verify permissions
        print("🔐 PERMISSIONS CHECK:")
        print("=" * 30)
        print(f"✅ Can access admin panel: {super_admin.is_staff}")
        print(f"✅ Has all permissions: {super_admin.is_superuser}")
        print(f"✅ Account active: {super_admin.is_active}")
        
        # Add to admin groups if they exist
        try:
            admin_group, created = Group.objects.get_or_create(name='Administrators')
            super_admin.groups.add(admin_group)
            print(f"✅ Added to Administrators group")
        except Exception as e:
            print(f"⚠️  Could not add to admin group: {e}")
        
        return super_admin
        
    except Exception as e:
        print(f"❌ Error creating super admin user: {e}")
        return None

def verify_login_credentials():
    """Verify that the created user can authenticate"""
    
    print()
    print("🔍 VERIFYING LOGIN CREDENTIALS:")
    print("=" * 40)
    
    from django.contrib.auth import authenticate
    
    username = "admin@rugrel.in"
    password = "Rugrel@321"
    
    # Test authentication
    user = authenticate(username=username, password=password)
    
    if user:
        print("✅ Authentication successful!")
        print(f"👤 Authenticated user: {user.username}")
        print(f"⭐ Is superuser: {user.is_superuser}")
        print(f"🛡️ Is staff: {user.is_staff}")
        return True
    else:
        print("❌ Authentication failed!")
        
        # Try to get user and check details
        try:
            user = User.objects.get(username=username)
            print(f"User exists but authentication failed:")
            print(f"- Is active: {user.is_active}")
            print(f"- Password set: {user.has_usable_password()}")
        except User.DoesNotExist:
            print("User does not exist!")
        
        return False

def main():
    """Main execution function"""
    
    print("🚀 RUGREL SUPER ADMIN CREATION SCRIPT")
    print("=" * 50)
    print()
    
    # Create the super admin user
    super_admin = create_rugrel_super_admin()
    
    if super_admin:
        # Verify login credentials
        if verify_login_credentials():
            print()
            print("🎉 SUCCESS!")
            print("=" * 20)
            print("✅ Rugrel Super Admin user created and verified")
            print("✅ Ready for production use")
            print()
            print("📝 LOGIN CREDENTIALS:")
            print(f"   Username: admin@rugrel.in")
            print(f"   Password: Rugrel@321")
            print()
            print("🌐 Access URLs:")
            print(f"   Local Admin: http://localhost:8000/admin/")
            print(f"   Railway Admin: https://medixscan-production.up.railway.app/admin/")
            print(f"   Frontend: https://www.rugrel.in/")
        else:
            print()
            print("⚠️  WARNING: User created but login verification failed")
    else:
        print()
        print("❌ FAILED: Could not create super admin user")

if __name__ == "__main__":
    main()