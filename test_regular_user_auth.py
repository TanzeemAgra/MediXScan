#!/usr/bin/env python3
"""
Test Regular User Authentication and Role Access
Tests drnajeeb@gmail.com login and role-based access through the API
"""

import requests
import json
from datetime import datetime

# Railway Backend API Configuration
API_BASE_URL = "https://medixscan-production.up.railway.app"
API_ENDPOINTS = {
    'login': f"{API_BASE_URL}/api/auth/login/",
    'user_profile': f"{API_BASE_URL}/api/auth/user/",
    'rbac_check': f"{API_BASE_URL}/api/rbac/user-permissions/",
    'create_user': f"{API_BASE_URL}/api/auth/register/"
}

def test_user_login(email, password):
    """Test user login through API"""
    try:
        print(f"🔐 Testing login for: {email}")
        
        response = requests.post(API_ENDPOINTS['login'], 
                               json={'email': email, 'password': password},
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"   Token: {data.get('access_token', 'N/A')[:20]}...")
            print(f"   User: {data.get('user', {})}")
            return data.get('access_token'), data.get('user')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None, None

def check_user_permissions(token):
    """Check user permissions and roles"""
    if not token:
        return None
        
    try:
        print(f"\n🛡️ Checking user permissions...")
        
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(API_ENDPOINTS['rbac_check'], headers=headers)
        
        if response.status_code == 200:
            permissions = response.json()
            print(f"✅ Permissions retrieved:")
            print(f"   Roles: {permissions.get('roles', [])}")
            print(f"   Permissions: {permissions.get('permissions', [])}")
            print(f"   Is Staff: {permissions.get('is_staff', False)}")
            print(f"   Is Superuser: {permissions.get('is_superuser', False)}")
            return permissions
        else:
            print(f"❌ Permission check failed: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Permission check error: {e}")
        return None

def create_regular_user():
    """Create drnajeeb@gmail.com user if doesn't exist"""
    try:
        print(f"\n👤 Attempting to create user drnajeeb@gmail.com...")
        
        user_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123',
            'password_confirm': 'Najeeb@123',
            'first_name': 'Dr',
            'last_name': 'Najeeb',
            'role': 'Doctor'  # Regular doctor role, not admin
        }
        
        response = requests.post(API_ENDPOINTS['create_user'], 
                               json=user_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code in [200, 201]:
            print(f"✅ User created successfully!")
            return True
        elif response.status_code == 400:
            error_data = response.json()
            if 'already exists' in str(error_data).lower():
                print(f"ℹ️ User already exists")
                return True
            else:
                print(f"❌ User creation failed: {error_data}")
                return False
        else:
            print(f"❌ User creation failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ User creation error: {e}")
        return False

def main():
    """Main test function"""
    print("🏥 Regular User Authentication Test")
    print("=" * 50)
    
    email = 'drnajeeb@gmail.com'
    password = 'Najeeb@123'
    
    # First try to login
    token, user = test_user_login(email, password)
    
    # If login fails, try to create user
    if not token:
        print(f"\n📝 Login failed, attempting to create user...")
        if create_regular_user():
            print(f"🔄 Retrying login after user creation...")
            token, user = test_user_login(email, password)
    
    # Check permissions if login successful
    if token:
        permissions = check_user_permissions(token)
        
        print(f"\n📊 User Access Summary:")
        print(f"   Email: {email}")
        print(f"   Name: {user.get('first_name', '')} {user.get('last_name', '')}")
        print(f"   Active: {user.get('is_active', False)}")
        print(f"   Staff: {user.get('is_staff', False)}")
        print(f"   Superuser: {user.get('is_superuser', False)}")
        
        if permissions:
            print(f"   Expected Access: Radiology features only")
            print(f"   Should NOT access: Super admin features")
            
        print(f"\n✅ User authentication working!")
        print(f"🔗 Test login at: https://www.rugrel.in/auth/sign-in")
        
    else:
        print(f"\n❌ User authentication failed")
        print(f"🔧 Manual user creation may be required")

if __name__ == "__main__":
    main()