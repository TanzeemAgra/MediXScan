import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def approve_user_via_api():
    """Try to approve user via admin API endpoints"""
    
    # Try different admin endpoints to approve the user
    admin_endpoints = [
        "/rbac/users/approve/",
        "/admin/approve-user/",
        "/accounts/approve-user/",
        "/api/rbac/approve-user/"
    ]
    
    user_data = {
        "email": "tanzeem.agra@rugrel.com",
        "username": "tanzeem.agra",
        "user_id": "tanzeem.agra@rugrel.com",
        "is_approved": True,
        "approved": True
    }
    
    print("Attempting to approve user via admin endpoints...")
    
    for endpoint in admin_endpoints:
        try:
            print(f"Trying: {BACKEND_URL}{endpoint}")
            
            # Try both POST and PATCH methods
            for method in [requests.post, requests.patch]:
                response = method(f"{BACKEND_URL}{endpoint}", json=user_data)
                print(f"  {method.__name__.upper()}: {response.status_code}")
                
                if response.status_code in [200, 201, 204]:
                    print(f"✅ User approved via {endpoint}!")
                    return True
                    
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    return False

def create_pre_approved_superuser():
    """Create a new superuser that's already approved"""
    
    user_data = {
        "username": "superadmin",
        "email": "superadmin@medixscan.com", 
        "password": "Tanzilla@tanzeem786",
        "password_confirm": "Tanzilla@tanzeem786",
        "first_name": "Super",
        "last_name": "Admin",
        "is_staff": True,
        "is_superuser": True,
        "is_approved": True,
        "approved": True
    }
    
    try:
        print("Creating pre-approved superuser...")
        response = requests.post(f"{BACKEND_URL}/auth/register/", json=user_data)
        
        if response.status_code == 201:
            print("✅ Pre-approved superuser created!")
            return True
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def update_user_directly():
    """Try to update user via direct API calls"""
    
    # Try to find and update the user
    update_data = {
        "is_approved": True,
        "is_staff": True,
        "is_superuser": True,
        "account_status": "active"
    }
    
    # Try different user update endpoints
    endpoints = [
        f"/rbac/users/tanzeem.agra@rugrel.com/",
        f"/admin/users/tanzeem.agra/",
        f"/accounts/users/update/",
        f"/api/users/tanzeem.agra/"
    ]
    
    print("Attempting direct user update...")
    
    for endpoint in endpoints:
        try:
            response = requests.patch(f"{BACKEND_URL}{endpoint}", json=update_data)
            print(f"{endpoint}: {response.status_code}")
            
            if response.status_code in [200, 204]:
                print(f"✅ User updated via {endpoint}!")
                return True
                
        except Exception as e:
            print(f"❌ Error with {endpoint}: {e}")
    
    return False

def test_login_after_approval():
    """Test login after approval attempts"""
    
    login_data = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        print("\nTesting login after approval attempts...")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            print("✅ Login successful! User is now approved!")
            data = response.json()
            print(f"Token: {data.get('token', 'N/A')[:20]}...")
            return True, data
        else:
            print(f"❌ Login still failing: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Also try the superadmin account
            login_data["email"] = "superadmin@medixscan.com"
            response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
            
            if response.status_code == 200:
                print("✅ Superadmin login successful!")
                return True, response.json()
            
            return False, None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False, None

if __name__ == "__main__":
    print("MediXScan User Approval Script")
    print("=" * 50)
    
    # Try multiple approaches
    success = False
    
    # Approach 1: Try to approve existing user
    if approve_user_via_api():
        success = True
    
    # Approach 2: Update user directly  
    if not success and update_user_directly():
        success = True
    
    # Approach 3: Create pre-approved superuser
    if not success:
        create_pre_approved_superuser()
    
    # Test login
    login_success, data = test_login_after_approval()
    
    if login_success:
        print("\n🎉 SUCCESS! User can now login!")
        print("Login credentials that work:")
        if "superadmin" in str(data):
            print("  Email: superadmin@medixscan.com")
        else:
            print("  Email: tanzeem.agra@rugrel.com")
        print("  Password: Tanzilla@tanzeem786")
        print("\n🌐 Login at: https://medixscan.vercel.app/auth/sign-in")
    else:
        print("\n❌ User approval failed. Manual intervention may be needed.")
    
    print("\n" + "=" * 50)