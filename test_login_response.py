import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def test_login_response():
    """Test what the login API actually returns"""
    
    login_data = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    try:
        print("Testing login API response structure...")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print("Login successful!")
            print("Response structure:")
            print(json.dumps(data, indent=2))
            
            # Check if user object has is_superuser field
            if 'user' in data:
                user = data['user']
                print(f"\nUser object keys: {list(user.keys())}")
                print(f"is_superuser: {user.get('is_superuser')}")
                print(f"is_staff: {user.get('is_staff')}")
                print(f"roles: {user.get('roles', [])}")
                print(f"permissions: {user.get('permissions', [])}")
            
            return data
        else:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_profile_endpoint(token):
    """Test the profile endpoint that AuthContext uses"""
    
    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        print("\nTesting profile endpoint...")
        response = requests.get(f"{BACKEND_URL}/auth/profile/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("Profile endpoint successful!")
            print("Profile structure:")
            print(json.dumps(data, indent=2))
            return data
        else:
            print(f"Profile request failed: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Profile error: {e}")
        return None

if __name__ == "__main__":
    print("Testing MediXScan Login API Response")
    print("=" * 50)
    
    # Test login
    login_response = test_login_response()
    
    if login_response and 'token' in login_response:
        # Test profile endpoint
        test_profile_endpoint(login_response['token'])
        
        print("\n" + "=" * 50)
        print("Summary of findings:")
        
        if 'user' in login_response:
            user = login_response['user']
            has_superuser_flag = 'is_superuser' in user and user['is_superuser']
            has_staff_flag = 'is_staff' in user and user['is_staff']
            
            print(f"✅ User has is_superuser: {has_superuser_flag}")
            print(f"✅ User has is_staff: {has_staff_flag}")
            
            if has_superuser_flag:
                print("✅ User should see RBAC Management!")
            else:
                print("❌ User won't see RBAC Management - missing is_superuser=true")
        
    else:
        print("❌ Could not test - login failed")