#!/usr/bin/env python3
"""
Create a test user for the Railway deployed MediXScan application
"""
import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def create_test_user():
    """Create a test user via the API"""
    
    # User data
    user_data = {
        "username": "testuser",
        "email": "test@medixscan.com", 
        "password": "Test123!",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        # Try to register a new user
        print("🔧 Creating test user via API...")
        response = requests.post(f"{BACKEND_URL}/auth/register/", json=user_data)
        
        if response.status_code == 201:
            print("✅ Test user created successfully!")
            print(f"👤 Username: {user_data['username']}")
            print(f"📧 Email: {user_data['email']}")
            print(f"🔑 Password: {user_data['password']}")
            return True
        else:
            print(f"❌ Failed to create user: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False

def test_login(username, password):
    """Test login with the created user"""
    try:
        login_data = {
            "username": username,
            "password": password
        }
        
        print(f"\n🔄 Testing login for user: {username}")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return False

if __name__ == "__main__":
    print("🚀 MediXScan User Creation for Railway Deployment")
    print("=" * 50)
    
    # Create user
    if create_test_user():
        # Test login
        test_login("testuser", "Test123!")
    
    print("\n" + "=" * 50)
    print("✅ You can now login with:")
    print("   Username: testuser")
    print("   Password: Test123!")