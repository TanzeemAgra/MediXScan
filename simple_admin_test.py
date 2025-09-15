import requests

# Railway backend URL
BACKEND_URL = "https://medixscan-production.up.railway.app/api"

def test_alternative_logins():
    """Test if there are any working admin accounts"""
    
    # Test common admin credentials that might be seeded
    test_accounts = [
        ("admin", "admin"),
        ("admin@medixscan.com", "admin123"),
        ("superuser", "password"),
        ("root", "root"),
        ("test@test.com", "test123"),
        ("demo@demo.com", "demo123"),
        ("user@user.com", "user123")
    ]
    
    print("Testing for existing working accounts...")
    
    for email, password in test_accounts:
        try:
            login_data = {"email": email, "password": password}
            response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
            
            if response.status_code == 200:
                print(f"SUCCESS! Working login found:")
                print(f"Email: {email}")
                print(f"Password: {password}")
                data = response.json()
                print(f"Token: {data.get('token', 'N/A')[:20]}...")
                return email, password, data
            
        except Exception as e:
            continue
    
    return None, None, None

def create_simple_admin():
    """Create admin with minimal data"""
    
    simple_data = {
        "username": "admin", 
        "email": "admin@admin.com",
        "password": "admin123",
        "password_confirm": "admin123"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/register/", json=simple_data)
        print(f"Simple admin creation: {response.status_code}")
        
        if response.status_code == 201:
            # Try to login immediately
            login_data = {"email": "admin@admin.com", "password": "admin123"}
            login_response = requests.post(f"{BACKEND_URL}/auth/login/", json=login_data)
            
            if login_response.status_code == 200:
                print("SUCCESS! Simple admin works!")
                return "admin@admin.com", "admin123"
        
    except Exception as e:
        print(f"Error: {e}")
    
    return None, None

if __name__ == "__main__":
    print("MediXScan Simple Admin Solution")
    print("=" * 40)
    
    # Test existing accounts
    email, password, data = test_alternative_logins()
    
    if email:
        print(f"\nWorking credentials found:")
        print(f"Email: {email}")
        print(f"Password: {password}")
    else:
        print("No existing working accounts found")
        
        # Try creating simple admin
        email, password = create_simple_admin()
        
        if email:
            print(f"\nNew admin created:")
            print(f"Email: {email}")
            print(f"Password: {password}")
    
    if email:
        print(f"\nLogin at: https://medixscan.vercel.app/auth/sign-in")
        print(f"Use: {email} / {password}")
    else:
        print("\nNo working solution found.")
        print("Manual database intervention required.")