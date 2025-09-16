#!/usr/bin/env python3
"""
API-based User Approval for drnajeeb@gmail.com
Approve user through Railway backend API using super admin credentials
"""

import requests
import json
from datetime import datetime

# Railway Backend API Configuration
API_BASE_URL = "https://medixscan-production.up.railway.app"

def login_as_super_admin():
    """Login as super admin to get authorization token"""
    try:
        print("🔑 Logging in as super admin...")
        
        login_data = {
            'email': 'tanzeem.agra@rugrel.com',
            'password': 'TanzeemAgra@123'
        }
        
        response = requests.post(f"{API_BASE_URL}/api/auth/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Super admin logged in successfully")
            return token_data.get('access_token')
        else:
            print(f"❌ Super admin login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error during super admin login: {e}")
        return None

def check_user_exists(token):
    """Check if drnajeeb@gmail.com exists in the system"""
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        # Try to get user details
        response = requests.get(f"{API_BASE_URL}/api/rbac/users/", headers=headers)
        
        if response.status_code == 200:
            users = response.json()
            for user in users:
                if user.get('email') == 'drnajeeb@gmail.com':
                    print(f"✅ Found user: {user}")
                    return user
            
            print("❌ User drnajeeb@gmail.com not found in users list")
            return None
        else:
            print(f"❌ Failed to fetch users: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error checking user: {e}")
        return None

def approve_user_via_api(token, user_id):
    """Approve user through the backend API"""
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Try to approve user
        approve_data = {
            'user_id': user_id,
            'action': 'approve',
            'role': 'DOCTOR'
        }
        
        response = requests.post(f"{API_BASE_URL}/api/rbac/approve-user/", 
                               json=approve_data,
                               headers=headers)
        
        if response.status_code == 200:
            print(f"✅ User approved successfully via API")
            return True
        else:
            print(f"❌ API approval failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during API approval: {e}")
        return False

def create_manual_approval_sql():
    """Create SQL commands for manual database approval"""
    print("\n" + "="*60)
    print("🛠️  MANUAL DATABASE APPROVAL COMMANDS")
    print("="*60)
    print("If API approval doesn't work, use these SQL commands in Railway PostgreSQL:")
    print("\n1. Check if user exists:")
    print("   SELECT id, email, is_active FROM auth_user WHERE email = 'drnajeeb@gmail.com';")
    print("\n2. Activate user account:")
    print("   UPDATE auth_user SET is_active = true WHERE email = 'drnajeeb@gmail.com';")
    print("\n3. Create/Update user profile:")
    print("""   INSERT INTO auth_userprofile (user_id, role, department, specialization, is_approved) 
   VALUES ((SELECT id FROM auth_user WHERE email = 'drnajeeb@gmail.com'), 'DOCTOR', 'Radiology', 'General Radiology', true)
   ON CONFLICT (user_id) DO UPDATE SET is_approved = true, role = 'DOCTOR';""")
    print("\n4. Verify approval:")
    print("""   SELECT u.email, u.is_active, p.role, p.is_approved 
   FROM auth_user u 
   LEFT JOIN auth_userprofile p ON u.id = p.user_id 
   WHERE u.email = 'drnajeeb@gmail.com';""")
    print("="*60)

def test_user_login():
    """Test if drnajeeb@gmail.com can now login"""
    try:
        print("\n🧪 Testing user login after approval...")
        
        login_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123'
        }
        
        response = requests.post(f"{API_BASE_URL}/api/auth/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            print("🎉 User can now login successfully!")
            user_data = response.json()
            print(f"✅ Login response: {json.dumps(user_data, indent=2)}")
            return True
        else:
            print(f"❌ User still cannot login: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False

def main():
    """Main approval workflow"""
    print("🏥 User Approval Tool for drnajeeb@gmail.com")
    print("=" * 50)
    
    # Step 1: Login as super admin
    token = login_as_super_admin()
    if not token:
        print("❌ Cannot proceed without super admin token")
        create_manual_approval_sql()
        return
    
    # Step 2: Check if user exists
    user = check_user_exists(token)
    if not user:
        print("❌ User not found. Creating manual SQL commands...")
        create_manual_approval_sql()
        return
    
    # Step 3: Try to approve via API
    user_id = user.get('id')
    if user_id and approve_user_via_api(token, user_id):
        print("🎉 API approval successful!")
    else:
        print("⚠️  API approval failed. Creating manual SQL commands...")
        create_manual_approval_sql()
    
    # Step 4: Test login
    if test_user_login():
        print("\n✅ SUCCESS: drnajeeb@gmail.com is now fully approved and can login!")
    else:
        print("\n⚠️  Login test failed. Manual database intervention may be required.")
        create_manual_approval_sql()

if __name__ == "__main__":
    main()