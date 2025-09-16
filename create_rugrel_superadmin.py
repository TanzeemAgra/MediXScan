#!/usr/bin/env python3
"""
Create Rugrel Super Admin User
Purpose: Create admin@rugrel.in super admin with specified credentials
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

User = get_user_model()

def create_rugrel_super_admin():
    """Create Rugrel super admin user with specified credentials"""
    print("🔧 Creating Rugrel Super Admin user...")
    print("📧 Email: admin@rugrel.in")
    print("🔐 Password: Rugrel@321")
    print("-" * 50)
    
    # User details
    email = 'admin@rugrel.in'
    username = 'admin@rugrel.in'
    password = 'Rugrel@321'
    first_name = 'Rugrel'
    last_name = 'Admin'
    
    try:
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print("⚠️  User with this email already exists")
            user = User.objects.get(email=email)
            print(f"📋 Existing user: {user.username} ({user.email})")
            
            # Update password if needed
            if not user.check_password(password):
                user.set_password(password)
                user.save()
                print("🔄 Password updated successfully")
            else:
                print("✅ Password already correct")
                
        elif User.objects.filter(username=username).exists():
            print("⚠️  User with this username already exists")
            user = User.objects.get(username=username)
            print(f"📋 Existing user: {user.username} ({user.email})")
            
            # Update password if needed
            if not user.check_password(password):
                user.set_password(password)
                user.save()
                print("🔄 Password updated successfully")
            else:
                print("✅ Password already correct")
        else:
            # Create new user
            print("🆕 Creating new super admin user...")
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            print("✅ User created successfully")
        
        # Set as superuser and staff
        if not user.is_superuser:
            user.is_superuser = True
            print("🔧 Set as superuser")
        
        if not user.is_staff:
            user.is_staff = True
            print("🔧 Set as staff")
            
        if not user.is_active:
            user.is_active = True
            print("🔧 Activated user")
            
        # Save changes
        user.save()
        
        # Add to admin group if it exists
        try:
            admin_group, created = Group.objects.get_or_create(name='Administrators')
            if created:
                print("🆕 Created Administrators group")
            
            if not user.groups.filter(name='Administrators').exists():
                user.groups.add(admin_group)
                print("👥 Added to Administrators group")
            else:
                print("✅ Already in Administrators group")
                
        except Exception as group_error:
            print(f"⚠️  Group assignment warning: {group_error}")
        
        # Verify user capabilities
        print("\n" + "=" * 50)
        print("🔍 VERIFICATION:")
        print(f"📧 Email: {user.email}")
        print(f"👤 Username: {user.username}")
        print(f"👨‍💼 Full Name: {user.get_full_name()}")
        print(f"🔐 Is Superuser: {user.is_superuser}")
        print(f"👨‍💻 Is Staff: {user.is_staff}")
        print(f"✅ Is Active: {user.is_active}")
        print(f"👥 Groups: {', '.join([group.name for group in user.groups.all()])}")
        print(f"🏥 Can access admin: {user.has_perm('admin.view_user')}")
        
        # Test password
        password_check = user.check_password(password)
        print(f"🔐 Password verification: {'✅ PASSED' if password_check else '❌ FAILED'}")
        
        print("\n" + "=" * 50)
        print("🎉 RUGREL SUPER ADMIN CREATED SUCCESSFULLY!")
        print("📝 Login Credentials:")
        print(f"   • Email: {email}")
        print(f"   • Username: {username}")
        print(f"   • Password: {password}")
        print("🌐 Access URLs:")
        print("   • Production: https://www.rugrel.in")
        print("   • Admin Panel: https://medixscan-production.up.railway.app/admin/")
        print("=" * 50)
        
        return user
        
    except ValidationError as ve:
        print(f"❌ Validation Error: {ve}")
        return None
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return None

def verify_database_connection():
    """Verify database connection before creating user"""
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print("✅ Database connection verified")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main execution function"""
    print("🚀 RUGREL SUPER ADMIN CREATION SCRIPT")
    print("=" * 50)
    
    # Verify database connection
    if not verify_database_connection():
        print("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    try:
        # Create the super admin
        user = create_rugrel_super_admin()
        
        if user:
            print("\n✅ Script completed successfully!")
            print("🔧 The super admin user is ready for production use.")
        else:
            print("\n❌ Script failed to create user!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️  Script interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()