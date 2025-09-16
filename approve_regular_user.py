#!/usr/bin/env python3
"""
Approve Regular User Account
Approves drnajeeb@gmail.com account and sets up proper role-based access
"""

import requests
import json

# Railway Backend API Configuration
API_BASE_URL = "https://medixscan-production.up.railway.app"

def approve_user_account():
    """Approve drnajeeb@gmail.com user account using super admin credentials"""
    try:
        print("🔑 Logging in as super admin to approve user account...")
        
        # Login as super admin
        login_data = {
            'email': 'tanzeem.agra@rugrel.com',
            'password': 'TanzeemAgra@123'
        }
        
        response = requests.post(f"{API_BASE_URL}/api/auth/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code != 200:
            print(f"❌ Super admin login failed: {response.status_code}")
            return False
            
        admin_token = response.json().get('access_token')
        print(f"✅ Super admin logged in successfully")
        
        # Get list of pending users
        headers = {'Authorization': f'Bearer {admin_token}'}
        response = requests.get(f"{API_BASE_URL}/api/rbac/pending-users/", headers=headers)
        
        if response.status_code == 200:
            pending_users = response.json()
            print(f"📋 Found {len(pending_users)} pending users")
            
            # Find drnajeeb@gmail.com
            target_user = None
            for user in pending_users:
                if user.get('email') == 'drnajeeb@gmail.com':
                    target_user = user
                    break
            
            if target_user:
                print(f"👤 Found drnajeeb@gmail.com (ID: {target_user.get('id')})")
                
                # Approve the user account
                approve_data = {
                    'user_id': target_user['id'],
                    'approved': True,
                    'role': 'Doctor',  # Regular doctor role
                    'permissions': ['radiology_access', 'view_reports', 'create_reports']
                }
                
                response = requests.post(f"{API_BASE_URL}/api/rbac/approve-user/", 
                                       json=approve_data, headers=headers)
                
                if response.status_code in [200, 201]:
                    print(f"✅ User drnajeeb@gmail.com approved successfully!")
                    print(f"   Role: Doctor")
                    print(f"   Permissions: Radiology access only")
                    return True
                else:
                    print(f"❌ User approval failed: {response.status_code}")
                    print(f"   Response: {response.text}")
                    return False
            else:
                print(f"❌ drnajeeb@gmail.com not found in pending users")
                # Try alternative approval method
                return approve_user_alternative(admin_token)
        else:
            print(f"❌ Failed to get pending users: {response.status_code}")
            return approve_user_alternative(admin_token)
            
    except Exception as e:
        print(f"❌ Error approving user: {e}")
        return False

def approve_user_alternative(admin_token):
    """Alternative method to approve user directly"""
    try:
        print(f"\n🔄 Trying alternative approval method...")
        
        headers = {'Authorization': f'Bearer {admin_token}'}
        
        # Direct user update approach
        update_data = {
            'email': 'drnajeeb@gmail.com',
            'is_active': True,
            'is_approved': True,
            'role': 'Doctor'
        }
        
        response = requests.patch(f"{API_BASE_URL}/api/rbac/update-user/", 
                                json=update_data, headers=headers)
        
        if response.status_code in [200, 201]:
            print(f"✅ User approved via alternative method!")
            return True
        else:
            print(f"❌ Alternative approval failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Alternative approval error: {e}")
        return False

def test_approved_user_login():
    """Test login after approval"""
    try:
        print(f"\n🧪 Testing login after approval...")
        
        login_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123'
        }
        
        response = requests.post(f"{API_BASE_URL}/api/auth/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful after approval!")
            print(f"   User: {data.get('user', {}).get('email')}")
            print(f"   Role: {data.get('user', {}).get('role', 'N/A')}")
            return True
        else:
            print(f"❌ Login still failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test login error: {e}")
        return False

def main():
    """Main approval function"""
    print("🏥 User Account Approval System")
    print("=" * 40)
    
    if approve_user_account():
        print(f"\n✅ User account approval successful!")
        
        # Test login
        if test_approved_user_login():
            print(f"\n🎉 drnajeeb@gmail.com is now ready to login!")
            print(f"📧 Email: drnajeeb@gmail.com")
            print(f"🔑 Password: Najeeb@123")
            print(f"🔗 Login URL: https://www.rugrel.in/auth/sign-in")
            print(f"🏥 Access: Radiology features only (not admin)")
        else:
            print(f"\n⚠️ Account approved but login test failed")
            print(f"   Manual verification may be needed")
    else:
        print(f"\n❌ User account approval failed")
        print(f"   Manual database update may be required")

if __name__ == "__main__":
    main()