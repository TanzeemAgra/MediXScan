#!/usr/bin/env python3
"""
Backend API Explorer & User Creator
Explores available endpoints and creates users properly
"""
import requests
import json

BACKEND_URL = "https://medixscan-production.up.railway.app"

def explore_api_endpoints():
    """Explore available API endpoints"""
    
    print("🔍 Exploring Backend API Endpoints")
    print("=" * 60)
    
    base_endpoints = [
        "/api/",
        "/",
        "/admin/",
        "/auth/",
        "/accounts/"
    ]
    
    for endpoint in base_endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            print(f"📍 {endpoint} - Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    if isinstance(data, dict) and 'endpoints' in data:
                        print(f"   Available endpoints: {data['endpoints']}")
                    elif isinstance(data, list):
                        print(f"   Response type: List with {len(data)} items")
                    else:
                        print(f"   Response keys: {list(data.keys()) if isinstance(data, dict) else 'Non-dict response'}")
                except:
                    print(f"   Content length: {len(response.text)}")
                    
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")
    
    # Check specific auth endpoints
    auth_endpoints = [
        "/api/auth/login/",
        "/auth/login/", 
        "/api/accounts/login/",
        "/accounts/login/",
        "/login/"
    ]
    
    print("\n🔐 Checking Authentication Endpoints:")
    for endpoint in auth_endpoints:
        try:
            # Test with OPTIONS to see if endpoint exists
            response = requests.options(f"{BACKEND_URL}{endpoint}")
            print(f"📍 {endpoint} - Status: {response.status_code}")
            
            if response.status_code in [200, 405]:  # 405 = Method not allowed but endpoint exists
                print(f"   ✅ Endpoint exists")
            
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")

def test_admin_credentials():
    """Test various admin credential combinations"""
    
    print("\n🔐 Testing Admin Credentials")
    print("=" * 40)
    
    credentials = [
        {"email": "tanzeem.agra@rugrel.com", "password": "Tanzilla@tanzeem786"},
        {"username": "tanzeem.agra@rugrel.com", "password": "Tanzilla@tanzeem786"},
        {"email": "admin@admin.com", "password": "admin"},
        {"username": "admin", "password": "admin"}
    ]
    
    auth_endpoints = [
        "/api/auth/login/",
        "/auth/login/",
        "/api/accounts/login/", 
        "/accounts/login/",
        "/login/"
    ]
    
    for cred in credentials:
        print(f"\n🔑 Testing: {cred}")
        
        for endpoint in auth_endpoints:
            try:
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=cred)
                print(f"   {endpoint} - {response.status_code}")
                
                if response.status_code == 200:
                    print(f"   ✅ SUCCESS with {endpoint}")
                    return endpoint, cred, response.json()
                elif response.status_code != 404:
                    try:
                        error = response.json()
                        print(f"   📄 Error: {error}")
                    except:
                        print(f"   📄 Response: {response.text[:100]}")
                        
            except Exception as e:
                continue
    
    return None, None, None

def create_user_via_django_register():
    """Create user via Django registration endpoint"""
    
    print("\n👤 Creating User via Django Registration")
    print("=" * 50)
    
    user_data = {
        "username": "drnajeeb",
        "email": "drnajeeb@gmail.com",
        "password": "Najeeb@123",
        "password1": "Najeeb@123",
        "password2": "Najeeb@123",
        "first_name": "Dr",
        "last_name": "Najeeb"
    }
    
    register_endpoints = [
        "/api/auth/register/",
        "/auth/register/",
        "/api/accounts/register/",
        "/accounts/register/",
        "/register/",
        "/api/signup/",
        "/signup/"
    ]
    
    for endpoint in register_endpoints:
        try:
            response = requests.post(f"{BACKEND_URL}{endpoint}", json=user_data)
            print(f"📍 {endpoint} - Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"   ✅ User created successfully!")
                try:
                    result = response.json()
                    print(f"   📄 Response: {result}")
                    return True, endpoint
                except:
                    print(f"   📄 Raw response: {response.text}")
                    return True, endpoint
                    
            elif response.status_code != 404:
                try:
                    error = response.json()
                    print(f"   📄 Error: {error}")
                except:
                    print(f"   📄 Response: {response.text[:200]}")
                    
        except Exception as e:
            continue
    
    return False, None

def test_user_login_after_creation():
    """Test user login after creation"""
    
    print("\n🔐 Testing User Login After Creation")
    print("=" * 40)
    
    login_data = {
        "email": "drnajeeb@gmail.com",
        "password": "Najeeb@123"
    }
    
    # Also try username
    login_data_username = {
        "username": "drnajeeb",
        "password": "Najeeb@123"
    }
    
    auth_endpoints = [
        "/api/auth/login/",
        "/auth/login/",
        "/api/accounts/login/",
        "/accounts/login/",
        "/login/"
    ]
    
    for login_payload in [login_data, login_data_username]:
        print(f"\n🔑 Testing with: {list(login_payload.keys())[0]}")
        
        for endpoint in auth_endpoints:
            try:
                response = requests.post(f"{BACKEND_URL}{endpoint}", json=login_payload)
                print(f"   {endpoint} - {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"   ✅ LOGIN SUCCESS!")
                    print(f"   📄 Token: {result.get('token', 'N/A')}")
                    print(f"   📄 User: {result.get('user', {}).get('email', 'N/A')}")
                    return True, endpoint, result
                elif response.status_code != 404:
                    try:
                        error = response.json()
                        print(f"   📄 Error: {error}")
                    except:
                        print(f"   📄 Response: {response.text[:100]}")
                        
            except Exception as e:
                continue
    
    return False, None, None

def main():
    """Main execution flow"""
    
    print("🚀 Backend API Explorer & User Creator")
    print("=" * 60)
    
    # Step 1: Explore API structure
    explore_api_endpoints()
    
    # Step 2: Test admin credentials
    admin_endpoint, admin_creds, admin_response = test_admin_credentials()
    
    if admin_endpoint:
        print(f"\n✅ Found working admin endpoint: {admin_endpoint}")
        print(f"   Admin user: {admin_creds.get('email', admin_creds.get('username'))}")
    else:
        print("\n⚠️ No admin credentials working - proceeding with user creation")
    
    # Step 3: Create the user
    user_created, create_endpoint = create_user_via_django_register()
    
    if user_created:
        print(f"\n✅ User created via: {create_endpoint}")
        
        # Step 4: Test login
        login_success, login_endpoint, login_response = test_user_login_after_creation()
        
        if login_success:
            print(f"\n🎉 COMPLETE SUCCESS!")
            print(f"   User: drnajeeb@gmail.com")
            print(f"   Password: Najeeb@123")
            print(f"   Login Endpoint: {BACKEND_URL}{login_endpoint}")
        else:
            print(f"\n⚠️ User created but login still failing")
            
    else:
        print(f"\n❌ Could not create user via any endpoint")
    
    print(f"\n🎯 Next Steps:")
    print(f"   1. Try logging in at: https://medixscan.vercel.app/auth/sign-in")
    print(f"   2. Email: drnajeeb@gmail.com")
    print(f"   3. Password: Najeeb@123")

if __name__ == "__main__":
    main()