#!/usr/bin/env python3
"""
Smart User Authentication Diagnostic & Fix Tool
Diagnoses and fixes user authentication issues using soft coding technique
"""
import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def test_user_authentication(email, password):
    """Test user authentication and diagnose issues"""
    
    print(f"🔍 Diagnosing authentication for: {email}")
    print("=" * 60)
    
    # Test basic login
    login_data = {"email": email, "password": password}
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        print(f"🌐 Login API Response: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Authentication successful!")
            return True, response.json()
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📄 Error details: {error_data}")
                return False, error_data
            except:
                print(f"📄 Raw response: {response.text}")
                return False, {"error": response.text}
                
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False, {"error": str(e)}

def check_user_status_via_admin():
    """Check user status using admin credentials"""
    
    print("\n🔧 Checking user status via admin account...")
    
    # First login as admin
    admin_credentials = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        admin_response = requests.post(f"{BACKEND_URL}/auth/login/", json=admin_credentials)
        
        if admin_response.status_code == 200:
            admin_data = admin_response.json()
            admin_token = admin_data.get('token')
            
            print("✅ Admin login successful")
            
            # Check user via admin endpoints
            headers = {'Authorization': f'Token {admin_token}'}
            
            # Try different user lookup endpoints
            user_endpoints = [
                "/rbac/users/",
                "/admin/users/", 
                "/accounts/users/",
                "/users/"
            ]
            
            for endpoint in user_endpoints:
                try:
                    users_response = requests.get(f"{BACKEND_URL}{endpoint}", headers=headers)
                    if users_response.status_code == 200:
                        users_data = users_response.json()
                        print(f"✅ Found users via {endpoint}")
                        
                        # Look for our problem user
                        users_list = users_data if isinstance(users_data, list) else users_data.get('results', [])
                        
                        for user in users_list:
                            if user.get('email') == 'drnajeeb@gmail.com':
                                print(f"👤 Found user: {user.get('email')}")
                                print(f"   Status: Active={user.get('is_active')}, Approved={user.get('is_approved')}")
                                print(f"   Staff: {user.get('is_staff')}, Superuser: {user.get('is_superuser')}")
                                return user
                        
                except Exception as e:
                    continue
            
            return None
            
        else:
            print(f"❌ Admin login failed: {admin_response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Admin check failed: {e}")
        return None

def fix_user_activation(user_email):
    """Attempt to fix user activation issues"""
    
    print(f"\n🔧 Attempting to fix user activation for: {user_email}")
    
    # Try admin login first
    admin_credentials = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        admin_response = requests.post(f"{BACKEND_URL}/auth/login/", json=admin_credentials)
        
        if admin_response.status_code == 200:
            admin_data = admin_response.json()
            admin_token = admin_data.get('token')
            headers = {'Authorization': f'Token {admin_token}'}
            
            # Try to activate/approve the user
            activation_data = {
                "email": user_email,
                "is_active": True,
                "is_approved": True,
                "action": "activate_user"
            }
            
            # Try different activation endpoints
            activation_endpoints = [
                "/rbac/users/activate/",
                "/admin/activate-user/",
                "/accounts/activate/",
                "/users/activate/"
            ]
            
            for endpoint in activation_endpoints:
                try:
                    response = requests.post(f"{BACKEND_URL}{endpoint}", json=activation_data, headers=headers)
                    if response.status_code in [200, 201, 204]:
                        print(f"✅ User activated via {endpoint}")
                        return True
                except:
                    continue
            
            # Try PATCH method for user update
            update_endpoints = [
                f"/rbac/users/{user_email}/",
                f"/admin/users/update/",
                f"/accounts/users/update/"
            ]
            
            for endpoint in update_endpoints:
                try:
                    response = requests.patch(f"{BACKEND_URL}{endpoint}", json=activation_data, headers=headers)
                    if response.status_code in [200, 204]:
                        print(f"✅ User updated via {endpoint}")
                        return True
                except:
                    continue
            
            print("⚠️ Could not activate user via API")
            return False
            
    except Exception as e:
        print(f"❌ Fix attempt failed: {e}")
        return False

def create_properly_activated_user():
    """Create a new user with proper activation"""
    
    print("\n🔧 Creating properly activated user...")
    
    # Login as admin
    admin_credentials = {
        "email": "tanzeem.agra@rugrel.com", 
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        admin_response = requests.post(f"{BACKEND_URL}/auth/login/", json=admin_credentials)
        
        if admin_response.status_code == 200:
            admin_data = admin_response.json()
            admin_token = admin_data.get('token')
            headers = {'Authorization': f'Token {admin_token}'}
            
            # Create user with proper activation flags
            user_data = {
                "username": "drnajeeb",
                "email": "drnajeeb@gmail.com",
                "password": "Najeeb@123",
                "password_confirm": "Najeeb@123",
                "first_name": "Dr",
                "last_name": "Najeeb",
                "is_active": True,
                "is_approved": True,
                "approved": True,
                "force_activate": True
            }
            
            # Try different user creation endpoints
            create_endpoints = [
                "/rbac/users/create/",
                "/admin/create-user/",
                "/accounts/create/",
                "/auth/admin-register/"
            ]
            
            for endpoint in create_endpoints:
                try:
                    response = requests.post(f"{BACKEND_URL}{endpoint}", json=user_data, headers=headers)
                    if response.status_code in [200, 201]:
                        print(f"✅ User created successfully via {endpoint}")
                        return True
                except Exception as e:
                    continue
            
            print("⚠️ Could not create activated user via API")
            return False
            
    except Exception as e:
        print(f"❌ User creation failed: {e}")
        return False

def main():
    """Main diagnostic and fix routine"""
    
    print("🚀 Smart User Authentication Diagnostic Tool")
    print("=" * 60)
    
    email = "drnajeeb@gmail.com"
    password = "Najeeb@123"
    
    # Step 1: Test current authentication
    success, data = test_user_authentication(email, password)
    
    if success:
        print("✅ User can already login - no issues found!")
        return
    
    # Step 2: Check user status via admin
    user_info = check_user_status_via_admin()
    
    if user_info:
        print(f"\n📋 User found in system:")
        print(f"   Active: {user_info.get('is_active', 'Unknown')}")
        print(f"   Approved: {user_info.get('is_approved', 'Unknown')}")
        
        # Step 3: Try to fix activation
        if fix_user_activation(email):
            print("\n🔄 Attempting login after activation fix...")
            success, data = test_user_authentication(email, password)
            if success:
                print("✅ Fix successful! User can now login.")
                return
    
    # Step 4: Create new properly activated user
    print("\n🔄 Creating new properly activated user...")
    if create_properly_activated_user():
        print("\n🔄 Testing login with new user...")
        success, data = test_user_authentication(email, password)
        if success:
            print("✅ New user created and working!")
        else:
            print("❌ New user still having issues")
    
    print("\n" + "=" * 60)
    print("🎯 Summary:")
    print("   Email: drnajeeb@gmail.com")
    print("   Password: Najeeb@123") 
    print("   Login URL: https://medixscan.vercel.app/auth/sign-in")

if __name__ == "__main__":
    main()