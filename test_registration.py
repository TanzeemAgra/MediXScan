#!/usr/bin/env python3
"""
Quick test script to verify Django registration endpoint is working
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_registration():
    print("🔄 Testing Django registration endpoint...")
    
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
        # Test registration endpoint
        response = requests.post(
            f"{API_BASE}/api/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Registration endpoint working!")
            return True
        else:
            print(f"❌ Registration failed with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Is it running on port 8000?")
        return False
    except Exception as e:
        print(f"❌ Error testing registration: {e}")
        return False

def test_user_list():
    print("\n🔄 Testing user list endpoint...")
    
    try:
        # Test user list endpoint
        response = requests.get(
            f"{API_BASE}/api/auth/users/",
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Found {len(users)} users")
            for user in users[:3]:  # Show first 3 users
                print(f"  - {user.get('username', 'N/A')} ({user.get('email', 'N/A')})")
            return True
        else:
            print(f"❌ User list failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing user list: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing RBAC API endpoints...\n")
    
    # Test registration
    reg_ok = test_registration()
    
    # Test user list
    list_ok = test_user_list()
    
    print(f"\n📊 Results:")
    print(f"Registration: {'✅ Working' if reg_ok else '❌ Failed'}")
    print(f"User List: {'✅ Working' if list_ok else '❌ Failed'}")
    
    if reg_ok and list_ok:
        print("\n🎉 All endpoints working! The issue might be in the frontend.")
    else:
        print("\n⚠️  Some endpoints failed. Check Django server.")
