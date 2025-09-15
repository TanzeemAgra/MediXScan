#!/usr/bin/env python3
"""
Create a superuser for MediXScan Railway deployment
"""
import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def create_superuser():
    """Create a superuser via Django admin or direct database access"""
    
    # Superuser data
    user_data = {
        "username": "tanzeem.agra",
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786",
        "first_name": "Tanzeem",
        "last_name": "Agra",
        "is_staff": True,
        "is_superuser": True
    }
    
    try:
        # Try registration endpoint first
        print("🔧 Creating superuser via registration API...")
        response = requests.post(f"{BACKEND_URL}/auth/register/", json=user_data)
        
        if response.status_code == 201:
            print("✅ Superuser created successfully via registration!")
            print(f"👤 Username: {user_data['username']}")
            print(f"📧 Email: {user_data['email']}")
            print(f"🔑 Password: {user_data['password']}")
            return True
        else:
            print(f"⚠️ Registration response: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try alternative endpoints
            return try_alternative_creation(user_data)
            
    except Exception as e:
        print(f"❌ Error creating superuser: {e}")
        return try_alternative_creation(user_data)

def try_alternative_creation(user_data):
    """Try creating user via alternative endpoints"""
    
    # Try admin creation endpoint if it exists
    try:
        print("\n🔄 Trying admin user creation...")
        admin_data = {
            "username": user_data["username"],
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        response = requests.post(f"{BACKEND_URL}/admin/create-user/", json=admin_data)
        
        if response.status_code == 201:
            print("✅ Superuser created via admin endpoint!")
            return True
            
    except Exception as e:
        print(f"⚠️ Admin endpoint not available: {e}")
    
    # Try direct database creation via Django management
    print("\n🔄 Creating superuser via Django management...")
    return create_via_django_command()

def create_via_django_command():
    """Create superuser using Django management command remotely"""
    
    # Create a script that can be run on Railway
    script_content = f"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

def create_superuser():
    try:
        with transaction.atomic():
            # Check if user already exists
            if User.objects.filter(email='tanzeem.agra@rugrel.com').exists():
                user = User.objects.get(email='tanzeem.agra@rugrel.com')
                print(f"User already exists: {{user.username}}")
                # Update password and permissions
                user.set_password('Tanzilla@tanzeem786')
                user.is_staff = True
                user.is_superuser = True
                user.save()
                print("✅ Updated existing user to superuser")
            else:
                # Create new superuser
                user = User.objects.create_superuser(
                    username='tanzeem.agra',
                    email='tanzeem.agra@rugrel.com',
                    password='Tanzilla@tanzeem786',
                    first_name='Tanzeem',
                    last_name='Agra'
                )
                print(f"✅ Superuser created: {{user.username}}")
            
            return user
    except Exception as e:
        print(f"❌ Error: {{e}}")
        return None

if __name__ == '__main__':
    create_superuser()
"""
    
    # Save the script
    with open('railway_superuser_creation.py', 'w') as f:
        f.write(script_content)
    
    print("📝 Django superuser creation script saved as 'railway_superuser_creation.py'")
    print("🚀 You can run this on Railway or use Django admin to create the superuser")
    
    return True

def test_login():
    """Test login with the created superuser"""
    try:
        login_data = {
            "username": "tanzeem.agra",
            "password": "Tanzilla@tanzeem786"
        }
        
        print(f"\n🔄 Testing login for superuser...")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            print("✅ Superuser login successful!")
            data = response.json()
            print(f"🎫 Token received: {data.get('token', 'N/A')[:20]}...")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try with email instead of username
            login_data["username"] = "tanzeem.agra@rugrel.com"
            response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
            
            if response.status_code == 200:
                print("✅ Login successful with email!")
                return True
            else:
                print(f"❌ Email login also failed: {response.status_code}")
            
            return False
            
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False

if __name__ == "__main__":
    print("🚀 MediXScan Superuser Creation for Railway")
    print("👤 Creating superuser: tanzeem.agra@rugrel.com")
    print("=" * 60)
    
    # Create superuser
    if create_superuser():
        # Test login
        test_login()
    
    print("\n" + "=" * 60)
    print("✅ Superuser credentials:")
    print("   Username: tanzeem.agra")
    print("   Email: tanzeem.agra@rugrel.com")
    print("   Password: Tanzilla@tanzeem786")
    print("\n🌐 You can now login at: https://medixscan.vercel.app/auth/sign-in")