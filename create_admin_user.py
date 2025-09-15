#!/usr/bin/env python3
"""
Create an admin user for testing full RBAC functionality
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

User = get_user_model()

def create_admin_user():
    print("🔧 Creating admin user for RBAC testing...")
    
    # Check if admin user already exists
    if User.objects.filter(username='admin').exists():
        print("✅ Admin user already exists")
        admin_user = User.objects.get(username='admin')
    else:
        # Create admin user
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@medixscan.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            is_staff=True,
            is_superuser=True
        )
        print("✅ Admin user created successfully")
    
    print(f"👤 Admin user: {admin_user.username}")
    print(f"📧 Email: {admin_user.email}")
    print(f"🔑 Password: admin123")
    print(f"⭐ Is superuser: {admin_user.is_superuser}")
    print(f"🛡️ Is staff: {admin_user.is_staff}")
    
    return admin_user

def test_admin_api_access():
    print("\n🔄 Testing admin API access...")
    
    import requests
    
    try:
        # Login as admin
        login_response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json={'username': 'admin', 'password': 'admin123'},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            print(f"✅ Admin login successful")
            
            # Test user list access
            headers = {'Authorization': f'Token {token}'}
            users_response = requests.get(
                'http://localhost:8000/api/auth/users/',
                headers=headers,
                timeout=10
            )
            
            if users_response.status_code == 200:
                users = users_response.json()
                print(f"✅ Admin can access user list - {len(users)} users found")
                for user in users:
                    print(f"  - {user.get('username')} ({user.get('email', 'No email')})")
                return True
            else:
                print(f"❌ Admin user list access failed: {users_response.status_code}")
                
        else:
            print(f"❌ Admin login failed: {login_response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing admin access: {e}")
    
    return False

if __name__ == "__main__":
    print("🚀 Admin User Setup for RBAC Testing\n")
    
    try:
        # Create admin user
        admin_user = create_admin_user()
        
        # Test API access
        api_ok = test_admin_api_access()
        
        print(f"\n📊 Setup Results:")
        print(f"Admin User: ✅ Created/Available")
        print(f"API Access: {'✅ Working' if api_ok else '❌ Check server'}")
        
        if api_ok:
            print(f"\n🎉 Admin setup complete! You can now:")
            print(f"1. Login to frontend with admin/admin123")
            print(f"2. Access full user management features")
            print(f"3. See all users in the RBAC dashboard")
        else:
            print(f"\n⚠️  Admin user created but API access needs checking")
            
    except Exception as e:
        print(f"❌ Error setting up admin user: {e}")
        print(f"💡 Make sure Django server is running: python manage.py runserver 8000")
