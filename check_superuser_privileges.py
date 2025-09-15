import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def login_and_get_token():
    """Login and get authentication token"""
    login_data = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        print("Logging in to get user details...")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print("Login successful!")
            return data.get('token'), data
        else:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None, None
            
    except Exception as e:
        print(f"Error during login: {e}")
        return None, None

def check_user_privileges(token):
    """Check user privileges and roles"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Check user profile
        print("\nChecking user profile...")
        response = requests.get(f"{BACKEND_URL}/auth/user/", headers=headers)
        
        if response.status_code == 200:
            user_data = response.json()
            print("User Profile:")
            print(f"  Username: {user_data.get('username')}")
            print(f"  Email: {user_data.get('email')}")
            print(f"  Is Staff: {user_data.get('is_staff')}")
            print(f"  Is Superuser: {user_data.get('is_superuser')}")
            print(f"  Roles: {user_data.get('roles', [])}")
            return user_data
        else:
            print(f"Failed to get user profile: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error checking privileges: {e}")
        return None

def check_rbac_endpoints(token):
    """Check if RBAC management endpoints are accessible"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    endpoints_to_check = [
        "/rbac/users/",
        "/rbac/roles/", 
        "/rbac/permissions/",
        "/admin/users/",
        "/users/",
        "/accounts/users/"
    ]
    
    print("\nChecking RBAC endpoints accessibility:")
    accessible_endpoints = []
    
    for endpoint in endpoints_to_check:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", headers=headers)
            status = "✅ ACCESSIBLE" if response.status_code in [200, 201] else f"❌ {response.status_code}"
            print(f"  {endpoint}: {status}")
            
            if response.status_code in [200, 201]:
                accessible_endpoints.append(endpoint)
                
        except Exception as e:
            print(f"  {endpoint}: ❌ ERROR - {e}")
    
    return accessible_endpoints

def promote_to_admin_roles(token):
    """Try to promote user to admin roles if endpoints exist"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Try to assign admin roles
    admin_roles = ["Admin", "SuperAdmin", "SystemAdmin", "Manager"]
    
    for role in admin_roles:
        try:
            role_data = {"role": role, "user_email": "tanzeem.agra@rugrel.com"}
            response = requests.post(f"{BACKEND_URL}/rbac/assign-role/", json=role_data, headers=headers)
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully assigned role: {role}")
            else:
                print(f"⚠️ Could not assign role {role}: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error assigning role {role}: {e}")

if __name__ == "__main__":
    print("MediXScan Superuser Privilege Verification")
    print("=" * 50)
    
    # Login and get token
    token, login_data = login_and_get_token()
    
    if token:
        print(f"🎫 Token: {token[:20]}...")
        
        # Check user privileges
        user_data = check_user_privileges(token)
        
        # Check RBAC endpoints
        accessible = check_rbac_endpoints(token)
        
        # If user is superuser but doesn't have roles, try to promote
        if user_data and user_data.get('is_superuser') and not user_data.get('roles'):
            print("\n🔧 Superuser detected but no roles assigned. Attempting to assign admin roles...")
            promote_to_admin_roles(token)
        
        print(f"\n✅ Accessible RBAC endpoints: {len(accessible)}")
        for endpoint in accessible:
            print(f"  - {endpoint}")
            
    else:
        print("❌ Could not authenticate user")
    
    print("\n" + "=" * 50)