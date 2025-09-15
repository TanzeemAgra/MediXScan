#!/usr/bin/env python3
"""
Test script to verify user creation and list functionality with authentication
"""
import requests
import json

API_BASE = "http://localhost:8000"

def register_and_test():
    print("🔄 Testing full user workflow with authentication...")
    
    # Test data for user registration
    test_user = {
        "username": f"testuser_{int(__import__('time').time())}",
        "email": f"test_{int(__import__('time').time())}@example.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        # 1. Register user
        print("1️⃣ Creating new user...")
        response = requests.post(
            f"{API_BASE}/api/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 201:
            user_data = response.json()
            token = user_data.get('token')
            user_info = user_data.get('user')
            
            print(f"✅ User created: {user_info['username']} (ID: {user_info['id']})")
            print(f"🔑 Token: {token[:20]}...")
            
            # 2. Test getting users with authentication
            print("\n2️⃣ Testing user list with authentication...")
            headers = {
                'Authorization': f'Token {token}',
                'Content-Type': 'application/json'
            }
            
            list_response = requests.get(
                f"{API_BASE}/api/auth/users/",
                headers=headers,
                timeout=10
            )
            
            print(f"Status Code: {list_response.status_code}")
            
            if list_response.status_code == 200:
                users = list_response.json()
                print(f"✅ Found {len(users)} users")
                
                # Find our newly created user
                our_user = next((u for u in users if u['id'] == user_info['id']), None)
                if our_user:
                    print(f"✅ Our new user found in list: {our_user['username']}")
                else:
                    print("⚠️  Our new user not found in list")
                    
                return True
            else:
                print(f"❌ User list failed: {list_response.text}")
                return False
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_rbac_endpoints():
    print("\n🔄 Testing RBAC-specific endpoints...")
    
    # Try without auth first
    try:
        response = requests.get(f"{API_BASE}/api/rbac/users/", timeout=5)
        print(f"RBAC users endpoint (no auth): {response.status_code}")
    except:
        print("RBAC users endpoint not available")
    
    try:
        response = requests.get(f"{API_BASE}/api/rbac/dashboard-stats/", timeout=5)
        print(f"RBAC dashboard endpoint (no auth): {response.status_code}")
    except:
        print("RBAC dashboard endpoint not available")

if __name__ == "__main__":
    print("🚀 Full RBAC System Test\n")
    
    # Test full workflow
    success = register_and_test()
    
    # Test RBAC endpoints
    test_rbac_endpoints()
    
    print(f"\n📊 Result: {'✅ Working' if success else '❌ Failed'}")
    
    if success:
        print("\n🎉 Backend is working! The issue is likely in the frontend authentication or state management.")
    else:
        print("\n⚠️  Backend issues detected.")
