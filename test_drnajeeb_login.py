#!/usr/bin/env python3
"""
Test Login for drnajeeb@gmail.com
Check if the user can login with current credentials
"""

import requests
import json

# Railway Backend API Configuration
API_BASE_URL = "https://medixscan-production.up.railway.app"

def test_login():
    """Test login for drnajeeb@gmail.com"""
    try:
        print("🧪 Testing login for drnajeeb@gmail.com...")
        
        login_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123'
        }
        
        print(f"📡 Attempting login to: {API_BASE_URL}/api/auth/login/")
        
        response = requests.post(
            f"{API_BASE_URL}/api/auth/login/", 
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            print("🎉 LOGIN SUCCESSFUL!")
            user_data = response.json()
            print("✅ Login Response:")
            print(json.dumps(user_data, indent=2))
            
            # Check user details
            if 'user' in user_data:
                user = user_data['user']
                print(f"\n👤 User Details:")
                print(f"   ID: {user.get('id', 'N/A')}")
                print(f"   Email: {user.get('email', 'N/A')}")
                print(f"   Name: {user.get('first_name', '')} {user.get('last_name', '')}")
                print(f"   Active: {user.get('is_active', 'N/A')}")
                print(f"   Staff: {user.get('is_staff', 'N/A')}")
                print(f"   Role: {user.get('role', 'N/A')}")
            
            return True
            
        elif response.status_code == 400:
            print("❌ LOGIN FAILED - Bad Request")
            error_data = response.json()
            print(f"📋 Error Details: {error_data}")
            
            error_msg = error_data.get('error', '').lower()
            if 'pending approval' in error_msg:
                print("\n⚠️  ISSUE: User account is pending approval")
                print("🔧 SOLUTION: Need to activate account in Railway database")
                return False
            elif 'invalid' in error_msg:
                print("\n⚠️  ISSUE: Invalid credentials")
                print("🔧 Check username/password combination")
                return False
            else:
                print(f"\n⚠️  ISSUE: {error_data.get('error', 'Unknown error')}")
                return False
                
        elif response.status_code == 401:
            print("❌ LOGIN FAILED - Unauthorized")
            print("🔧 Invalid username or password")
            return False
            
        else:
            print(f"❌ LOGIN FAILED - HTTP {response.status_code}")
            print(f"📋 Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR - Cannot reach backend server")
        print(f"🌐 Backend URL: {API_BASE_URL}")
        return False
    except requests.exceptions.Timeout:
        print("❌ TIMEOUT ERROR - Backend server not responding")
        return False
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        return False

def check_backend_status():
    """Check if backend is running"""
    try:
        print("🔍 Checking backend status...")
        response = requests.get(f"{API_BASE_URL}/api/health/", timeout=5)
        
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Backend is running")
            print(f"📊 Status: {health_data.get('status', 'unknown')}")
            print(f"💾 Database: {health_data.get('database', 'unknown')}")
            return True
        else:
            print(f"⚠️  Backend responding but unhealthy: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Backend not accessible: {e}")
        return False

if __name__ == "__main__":
    print("🏥 Login Test for drnajeeb@gmail.com")
    print("=" * 50)
    
    # Check backend first
    if check_backend_status():
        print("\n" + "=" * 50)
        # Test login
        login_success = test_login()
        
        print("\n" + "=" * 50)
        if login_success:
            print("🎉 RESULT: You can login successfully!")
        else:
            print("❌ RESULT: Login failed - manual approval needed")
            print("\n🛠️  MANUAL FIX REQUIRED:")
            print("1. Go to Railway PostgreSQL database")
            print("2. Run: UPDATE auth_user SET is_active = true WHERE email = 'drnajeeb@gmail.com';")
            print("3. Run the profile creation SQL from previous instructions")
    else:
        print("❌ Cannot test login - backend not accessible")