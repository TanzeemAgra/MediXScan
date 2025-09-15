#!/usr/bin/env python3
"""
Fix admin user approval status and test login
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

User = get_user_model()

def fix_admin_user():
    print("🔧 Fixing admin user approval status...")
    
    try:
        admin_user = User.objects.get(username='admin')
        
        # Check and fix approval status
        if hasattr(admin_user, 'is_approved'):
            admin_user.is_approved = True
            print("✅ Set is_approved = True")
        
        admin_user.is_active = True
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        
        print(f"👤 Admin user fixed:")
        print(f"   Username: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   Is active: {admin_user.is_active}")
        print(f"   Is staff: {admin_user.is_staff}")
        print(f"   Is superuser: {admin_user.is_superuser}")
        if hasattr(admin_user, 'is_approved'):
            print(f"   Is approved: {admin_user.is_approved}")
        
        return admin_user
        
    except User.DoesNotExist:
        print("❌ Admin user not found")
        return None

def test_admin_login():
    print("\n🔄 Testing admin login with email...")
    
    import requests
    
    try:
        # Try login with email
        login_data = {
            "email": "admin@radiology.com",  # Use email instead of username
            "password": "admin123"
        }
        
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Login response: {response.status_code}")
        print(f"Response body: {response.text[:200]}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"✅ Admin login successful!")
            
            if token:
                # Test API access
                headers = {'Authorization': f'Token {token}'}
                users_response = requests.get(
                    'http://localhost:8000/api/auth/users/',
                    headers=headers,
                    timeout=10
                )
                
                print(f"User list access: {users_response.status_code}")
                if users_response.status_code == 200:
                    users = users_response.json()
                    print(f"✅ Admin can see {len(users)} users")
                    return True
        
        return False
        
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Admin User Fix and Test\n")
    
    # Fix admin user
    admin_user = fix_admin_user()
    
    if admin_user:
        # Test login
        login_ok = test_admin_login()
        
        print(f"\n📊 Results:")
        print(f"Admin User: ✅ Fixed")
        print(f"Login Test: {'✅ Working' if login_ok else '❌ Still issues'}")
        
        if login_ok:
            print(f"\n🎉 Admin access fully working!")
            print(f"💡 Frontend login credentials:")
            print(f"   Email: admin@radiology.com")
            print(f"   Password: admin123")
        else:
            print(f"\n⚠️  Check Django authentication setup")
    else:
        print(f"\n❌ Could not find/fix admin user")
