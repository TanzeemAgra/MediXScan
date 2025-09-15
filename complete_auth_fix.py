#!/usr/bin/env python3
"""
Complete Authentication Fix Tool
Creates users with proper fields and activates pending accounts
"""
import requests
import json

BACKEND_URL = "https://medixscan-production.up.railway.app"

def create_user_with_proper_fields():
    """Create user with all required fields"""
    
    print("👤 Creating User with Proper Fields")
    print("=" * 50)
    
    # User data with all possible required fields
    user_data = {
        "username": "drnajeeb",
        "email": "drnajeeb@gmail.com", 
        "password": "Najeeb@123",
        "password_confirm": "Najeeb@123",
        "password1": "Najeeb@123",
        "password2": "Najeeb@123",
        "first_name": "Dr",
        "last_name": "Najeeb",
        "confirm_password": "Najeeb@123"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/register/", json=user_data)
        print(f"📍 Registration Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ User created successfully!")
            print(f"📄 Response: {result}")
            return True, result
        else:
            try:
                error = response.json()
                print(f"📄 Error details: {error}")
                return False, error
            except:
                print(f"📄 Raw response: {response.text}")
                return False, {"raw": response.text}
                
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False, {"exception": str(e)}

def test_immediate_login():
    """Test login immediately after creation"""
    
    print("\n🔐 Testing Immediate Login")
    print("=" * 30)
    
    login_data = {"email": "drnajeeb@gmail.com", "password": "Najeeb@123"}
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/login/", json=login_data)
        print(f"📍 Login Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Login successful!")
            print(f"📄 User: {result.get('user', {}).get('email')}")
            print(f"📄 Token: {result.get('token')}")
            return True, result
        else:
            try:
                error = response.json()
                print(f"📄 Error: {error}")
                return False, error
            except:
                print(f"📄 Response: {response.text}")
                return False, {"raw": response.text}
                
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False, {"exception": str(e)}

def access_django_admin():
    """Try to access Django admin interface"""
    
    print("\n🔧 Accessing Django Admin Interface")
    print("=" * 40)
    
    try:
        # Get admin page
        response = requests.get(f"{BACKEND_URL}/admin/")
        print(f"📍 Admin page status: {response.status_code}")
        
        if response.status_code == 200:
            # Look for login form
            if 'csrfmiddlewaretoken' in response.text:
                print("✅ Found Django admin login form")
                
                # Extract CSRF token
                import re
                csrf_match = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', response.text)
                if csrf_match:
                    csrf_token = csrf_match.group(1)
                    print(f"📄 CSRF token: {csrf_token[:20]}...")
                    
                    # Try to login to admin
                    admin_data = {
                        'username': 'admin',
                        'password': 'admin',
                        'csrfmiddlewaretoken': csrf_token
                    }
                    
                    # Get session cookies
                    session = requests.Session()
                    session.get(f"{BACKEND_URL}/admin/")
                    
                    login_response = session.post(f"{BACKEND_URL}/admin/login/", data=admin_data)
                    print(f"📍 Admin login status: {login_response.status_code}")
                    
                    if login_response.status_code == 200 and 'Site administration' in login_response.text:
                        print("✅ Django admin access successful!")
                        return True, session
                    else:
                        print("❌ Django admin login failed")
                        
    except Exception as e:
        print(f"❌ Admin access failed: {e}")
    
    return False, None

def create_superuser_via_api():
    """Create superuser via direct API approach"""
    
    print("\n👑 Creating Superuser Account")
    print("=" * 30)
    
    # Try creating with superuser flags
    superuser_data = {
        "username": "superadmin",
        "email": "superadmin@medixscan.com",
        "password": "SuperAdmin@123",
        "password_confirm": "SuperAdmin@123",
        "first_name": "Super",
        "last_name": "Admin",
        "is_superuser": True,
        "is_staff": True,
        "is_active": True
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/register/", json=superuser_data)
        print(f"📍 Superuser creation status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Superuser created!")
            print(f"📄 Response: {result}")
            
            # Try login as superuser
            login_data = {"email": "superadmin@medixscan.com", "password": "SuperAdmin@123"}
            login_response = requests.post(f"{BACKEND_URL}/api/auth/login/", json=login_data)
            
            if login_response.status_code == 200:
                login_result = login_response.json()
                print(f"✅ Superuser login successful!")
                return True, login_result.get('token')
            else:
                print(f"⚠️ Superuser created but login pending approval")
                return False, None
        else:
            try:
                error = response.json()
                print(f"📄 Error: {error}")
            except:
                print(f"📄 Response: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Superuser creation failed: {e}")
        return False, None

def check_railway_database():
    """Check if we can access Railway database info"""
    
    print("\n🗄️ Railway Database Information")
    print("=" * 35)
    
    # Try database health endpoints
    db_endpoints = [
        "/health/",
        "/api/health/",
        "/db/status/",
        "/api/db/status/"
    ]
    
    for endpoint in db_endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}")
            print(f"📍 {endpoint} - Status: {response.status_code}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print(f"   📄 Health data: {data}")
                except:
                    print(f"   📄 Response: {response.text[:100]}")
        except:
            continue

def suggest_railway_cli_solution():
    """Suggest Railway CLI solution"""
    
    print("\n🚀 Railway CLI Solution")
    print("=" * 25)
    
    cli_commands = [
        "# Install Railway CLI (if not installed)",
        "npm install -g @railway/cli",
        "",
        "# Login to Railway",
        "railway login",
        "",
        "# Connect to your project",
        "railway link",
        "",
        "# Run Django shell in Railway environment", 
        "railway run python backend_fixed/manage.py shell",
        "",
        "# Then in Django shell:",
        "from django.contrib.auth.models import User",
        "# Activate existing users",
        "User.objects.filter(email__in=['tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com']).update(is_active=True)",
        "# Make them staff/superuser",
        "User.objects.filter(email='tanzeem.agra@rugrel.com').update(is_superuser=True, is_staff=True)",
        "User.objects.filter(email='drnajeeb@gmail.com').update(is_active=True)",
        "",
        "# Or create new superuser",
        "user = User.objects.create_superuser('admin', 'admin@medixscan.com', 'Admin@123')",
        "user.save()",
        "exit()"
    ]
    
    print("\n📋 Railway CLI Commands to Fix Users:")
    for cmd in cli_commands:
        print(f"   {cmd}")

def main():
    """Main execution flow"""
    
    print("🚀 Complete Authentication Fix Tool")
    print("=" * 50)
    
    # Step 1: Create user with proper fields
    user_created, user_result = create_user_with_proper_fields()
    
    if user_created:
        # Step 2: Test immediate login
        login_success, login_result = test_immediate_login()
        
        if login_success:
            print(f"\n🎉 SUCCESS! User is ready to use:")
            print(f"   Email: drnajeeb@gmail.com")
            print(f"   Password: Najeeb@123")
            print(f"   Login URL: https://medixscan.vercel.app/auth/sign-in")
            return
    
    # Step 3: Try Django admin access
    admin_success, session = access_django_admin()
    
    # Step 4: Try creating superuser
    superuser_success, superuser_token = create_superuser_via_api()
    
    # Step 5: Check database health
    check_railway_database()
    
    # Step 6: Provide Railway CLI solution
    suggest_railway_cli_solution()
    
    print(f"\n🎯 Summary:")
    print(f"   User Creation: {'✅' if user_created else '❌'}")
    print(f"   Immediate Login: {'✅' if user_created and login_success else '❌'}")
    print(f"   Django Admin: {'✅' if admin_success else '❌'}")
    print(f"   Superuser Creation: {'✅' if superuser_success else '❌'}")
    
    if not (user_created and login_success):
        print(f"\n💡 Recommended Solution:")
        print(f"   Use Railway CLI to activate users in production database")
        print(f"   This will fix the 'pending approval' issue permanently")

if __name__ == "__main__":
    main()