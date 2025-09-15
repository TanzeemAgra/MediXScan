import requests
import json

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def create_superuser_simple():
    """Create a superuser with proper API format"""
    
    # User data with password confirmation
    user_data = {
        "username": "tanzeem.agra",
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786",
        "password_confirm": "Tanzilla@tanzeem786",
        "first_name": "Tanzeem",
        "last_name": "Agra"
    }
    
    try:
        print("Creating superuser via registration API...")
        response = requests.post(f"{BACKEND_URL}/auth/register/", json=user_data)
        
        if response.status_code == 201:
            print("SUCCESS! Superuser created successfully!")
            print(f"Username: {user_data['username']}")
            print(f"Email: {user_data['email']}")
            print(f"Password: {user_data['password']}")
            return True
        else:
            print(f"Failed to create user: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error creating superuser: {e}")
        return False

def test_login():
    """Test login with the created superuser"""
    try:
        login_data = {
            "username": "tanzeem.agra",
            "password": "Tanzilla@tanzeem786"
        }
        
        print("Testing login...")
        response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
        
        if response.status_code == 200:
            print("Login successful!")
            data = response.json()
            if 'token' in data:
                print(f"Token received: {data['token'][:20]}...")
            return True
        else:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"Error testing login: {e}")
        return False

if __name__ == "__main__":
    print("MediXScan Superuser Creation")
    print("Creating superuser: tanzeem.agra@rugrel.com")
    print("=" * 50)
    
    # Create superuser
    if create_superuser_simple():
        # Test login
        test_login()
    
    print("\nSuperuser credentials:")
    print("Username: tanzeem.agra")
    print("Email: tanzeem.agra@rugrel.com")
    print("Password: Tanzilla@tanzeem786")
    print("\nYou can now login at: https://medixscan.vercel.app/auth/sign-in")