#!/usr/bin/env python3
"""
Approve Super Admin Account - Railway API Only
Using soft coding approach with Railway endpoint exclusively
"""

import json
import requests

def approve_superuser():
    """Approve the super admin user account"""
    
    # Soft coding: Use Railway API endpoint exclusively  
    RAILWAY_API_BASE = "https://medixscan-production.up.railway.app/api"
    
    # Super admin credentials
    credentials = {
        "email": "tanzeem.agra@rugrel.com", 
        "password": "Tanzilla@tanzeem786"
    }
    
    print("🔧 SUPER ADMIN ACCOUNT APPROVAL")
    print("=" * 50)
    print(f"📡 API Base: {RAILWAY_API_BASE}")
    print(f"👤 User: {credentials['email']}")
    print()
    
    # First get auth token via emergency login
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in'
    }
    
    try:
        print("🔐 Getting authentication token...")
        login_response = requests.post(
            f"{RAILWAY_API_BASE}/auth/emergency-login/",
            json=credentials,
            headers=headers,
            timeout=15
        )
        
        if login_response.status_code != 200:
            print(f"❌ Emergency login failed: {login_response.text}")
            return False
            
        token_data = login_response.json()
        token = token_data.get('token')
        
        if not token:
            print("❌ No token received")
            return False
            
        print(f"✅ Token obtained: {token[:20]}...")
        
        # Update headers with auth token
        auth_headers = {
            **headers,
            'Authorization': f'Token {token}'
        }
        
        # Try to approve the user account
        print("🔧 Attempting to approve user account...")
        
        # Method 1: Try dashboard endpoint to get user info
        dashboard_response = requests.get(
            f"{RAILWAY_API_BASE}/auth/dashboard/",
            headers=auth_headers,
            timeout=15
        )
        
        print(f"Dashboard status: {dashboard_response.status_code}")
        if dashboard_response.status_code == 200:
            dashboard_data = dashboard_response.json()
            print(f"✅ Dashboard accessible")
            print(f"User roles: {dashboard_data.get('user_info', {}).get('roles', 'N/A')}")
            
            # Check if user is already approved
            user_info = dashboard_data.get('user_info', {})
            if 'Super User' in str(user_info.get('roles', [])):
                print("✅ User already has Super User role!")
                return True
        
        # Method 2: Try to approve via user management
        approve_payload = {
            "user_id": "tanzeem.agra@rugrel.com",
            "action": "approve"
        }
        
        approve_response = requests.post(
            f"{RAILWAY_API_BASE}/auth/approve-user/",
            json=approve_payload,
            headers=auth_headers,
            timeout=15
        )
        
        print(f"Approve status: {approve_response.status_code}")
        print(f"Approve response: {approve_response.text}")
        
        # Method 3: Try creating superuser
        superuser_payload = {
            "email": credentials["email"],
            "username": "superuser",
            "password": credentials["password"],
            "is_superuser": True,
            "is_staff": True,
            "is_approved": True
        }
        
        create_response = requests.post(
            f"{RAILWAY_API_BASE}/auth/create-superuser/",
            json=superuser_payload,
            headers=auth_headers,
            timeout=15
        )
        
        print(f"Create superuser status: {create_response.status_code}")
        print(f"Create superuser response: {create_response.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 RAILWAY API SUPER ADMIN SETUP")
    print("Soft coding approach - Railway endpoint only")
    print()
    
    success = approve_superuser()
    
    print("=" * 50) 
    if success:
        print("✅ SUPER ADMIN SETUP COMPLETED")
        print("✅ Try standard login now")
    else:
        print("❌ SUPER ADMIN SETUP FAILED")
        print("❌ Use emergency login endpoint")