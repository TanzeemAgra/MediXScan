#!/usr/bin/env python3
"""
Manual User Approval via Direct API Call
Simple approach to approve drnajeeb@gmail.com without complex API dependencies
"""

import requests
import json

def test_simple_login():
    """Test simple login approach"""
    try:
        print("🔐 Testing simple login for drnajeeb@gmail.com...")
        
        # Try different login endpoints
        endpoints = [
            "https://medixscan-production.up.railway.app/api/auth/login/",
            "https://medixscan-production.up.railway.app/auth/login/",
            "https://medixscan-production.up.railway.app/login/",
            "https://medixscan-production.up.railway.app/api/login/"
        ]
        
        login_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123'
        }
        
        for endpoint in endpoints:
            try:
                print(f"\nTrying endpoint: {endpoint}")
                response = requests.post(endpoint, json=login_data, timeout=10)
                print(f"Status: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
                if response.status_code == 200:
                    print("✅ Login successful!")
                    return True
                elif response.status_code == 400:
                    if "pending approval" in response.text.lower():
                        print("⚠️ Account pending approval")
                    else:
                        print("❌ Bad request")
                elif response.status_code == 401:
                    print("❌ Invalid credentials")
                elif response.status_code == 404:
                    print("❌ Endpoint not found")
                    
            except Exception as e:
                print(f"❌ Error: {e}")
                continue
                
        return False
        
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return False

def create_test_user():
    """Try to create user via different endpoints"""
    try:
        print("\n👤 Attempting to create/update user...")
        
        user_data = {
            'email': 'drnajeeb@gmail.com',
            'password': 'Najeeb@123',
            'first_name': 'Dr',
            'last_name': 'Najeeb',
            'is_active': True,
            'role': 'DOCTOR'
        }
        
        endpoints = [
            "https://medixscan-production.up.railway.app/api/auth/register/",
            "https://medixscan-production.up.railway.app/api/users/create/",
            "https://medixscan-production.up.railway.app/register/"
        ]
        
        for endpoint in endpoints:
            try:
                print(f"\nTrying create endpoint: {endpoint}")
                response = requests.post(endpoint, json=user_data, timeout=10)
                print(f"Status: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                
                if response.status_code in [200, 201]:
                    print("✅ User created/updated!")
                    return True
                    
            except Exception as e:
                print(f"❌ Error: {e}")
                continue
                
        return False
        
    except Exception as e:
        print(f"❌ Create user error: {e}")
        return False

def main():
    """Main function"""
    print("🏥 Manual User Approval for drnajeeb@gmail.com")
    print("=" * 50)
    
    # Test current login status
    if test_simple_login():
        print("\n✅ User can already login successfully!")
    else:
        print("\n❌ User cannot login - trying to create/approve...")
        
        if create_test_user():
            print("\n🔄 Retesting login after user creation...")
            if test_simple_login():
                print("\n✅ User login now working!")
            else:
                print("\n❌ User still cannot login")
        else:
            print("\n❌ Could not create/approve user")
    
    print(f"\n📋 Manual Steps if Automated Approach Fails:")
    print(f"1. Login to Railway PostgreSQL via Railway dashboard")
    print(f"2. Run SQL: UPDATE auth_user SET is_active=true WHERE email='drnajeeb@gmail.com';")
    print(f"3. Test login at: https://www.rugrel.in/auth/sign-in")
    print(f"4. Email: drnajeeb@gmail.com")
    print(f"5. Password: Najeeb@123")
    
    print(f"\n🚀 Expected Result After Fix:")
    print(f"- User can login successfully")  
    print(f"- User has DOCTOR role (radiology access only)")
    print(f"- User cannot access admin features")
    print(f"- Navigation shows only radiology-related items")

if __name__ == "__main__":
    main()