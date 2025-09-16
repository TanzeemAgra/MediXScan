#!/usr/bin/env python3
"""
Railway Emergency API Caller
============================
Calls the Railway emergency API endpoints to fix super admin approval
"""

import requests
import json

RAILWAY_API_BASE = "https://medixscan-production.up.railway.app/api/auth"

def check_admin_status():
    """Check current admin status via API"""
    print("📊 Checking current admin status...")
    
    try:
        response = requests.get(f"{RAILWAY_API_BASE}/emergency/status/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Status check successful:")
            print(json.dumps(data, indent=2))
            return data
        else:
            print(f"❌ Status check failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Status check error: {e}")
        return None

def approve_admin():
    """Approve admin via emergency API"""
    print("🔧 Attempting to approve super admin...")
    
    try:
        response = requests.post(
            f"{RAILWAY_API_BASE}/emergency/approve-admin/",
            json={'email': 'tanzeem.agra@rugrel.com'},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin approval successful:")
            print(json.dumps(data, indent=2))
            return data
        else:
            print(f"❌ Admin approval failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Admin approval error: {e}")
        return None

def test_login():
    """Test login with super admin credentials"""
    print("🔐 Testing login with super admin credentials...")
    
    try:
        response = requests.post(
            f"{RAILWAY_API_BASE}/login/",
            json={
                'email': 'tanzeem.agra@rugrel.com',
                'password': 'Tanzilla@tanzeem786'
            },
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login test successful:")
            print(f"Token: {data.get('token', 'No token')}")
            print(f"User: {data.get('user', {}).get('email', 'No user info')}")
            return True
        else:
            print(f"❌ Login test failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return False

def main():
    """Main function to fix Railway admin"""
    print("🚂 Railway Emergency Admin Fix")
    print("=" * 50)
    
    # Step 1: Check current status
    status = check_admin_status()
    
    if status and status.get('login_should_work'):
        print("✅ Admin appears to be properly configured!")
        print("🔍 Testing login to confirm...")
        
        if test_login():
            print("🎉 Login works! No fix needed.")
            return True
    
    # Step 2: Try to approve admin
    print("\n🔧 Attempting to fix admin approval...")
    approval_result = approve_admin()
    
    if approval_result and approval_result.get('success'):
        print("✅ Admin approval successful!")
        
        # Step 3: Test login
        print("\n🔐 Testing login after fix...")
        if test_login():
            print("\n🎉 SUCCESS! Login is now working!")
            print("🔗 You can now login at: https://www.rugrel.in/auth/sign-in")
            print("🔑 Credentials:")
            print("   Email: tanzeem.agra@rugrel.com")
            print("   Password: Tanzilla@tanzeem786")
            return True
        else:
            print("⚠️  Admin was approved but login still fails")
            return False
    else:
        print("❌ Failed to approve admin via API")
        return False

if __name__ == '__main__':
    success = main()
    
    if not success:
        print("\n🔧 Alternative Solutions:")
        print("1. Wait for Railway deployment to run management command")
        print("2. Check Railway logs for deployment errors")
        print("3. Use emergency login endpoint temporarily")
        print("4. Contact Railway support if database issues persist")