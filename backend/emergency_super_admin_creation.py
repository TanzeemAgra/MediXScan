#!/usr/bin/env python3

import requests
import json

def create_super_admin_via_api():
    """
    Create super admin via a direct API call to the management endpoint
    """
    print("=== CREATING SUPER ADMIN VIA API ===")
    
    # Create a management API endpoint call
    management_url = "https://medixscan-production.up.railway.app/api/management/create-superuser/"
    
    admin_data = {
        'username': 'admin@rugrel.in',
        'email': 'admin@rugrel.in',
        'password': 'Rugrel@321',
        'first_name': 'Admin',
        'last_name': 'Rugrel'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in'
    }
    
    try:
        response = requests.post(management_url, json=admin_data, headers=headers, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ Super admin created via API!")
            return True
        else:
            print("❌ API creation failed, will try direct database approach")
            return False
            
    except Exception as e:
        print(f"❌ API call failed: {e}")
        return False

def test_login_after_creation():
    """
    Test login immediately after creation
    """
    print("\n=== TESTING LOGIN AFTER CREATION ===")
    
    login_url = "https://medixscan-production.up.railway.app/api/auth/login/"
    login_data = {
        'email': 'admin@rugrel.in',
        'password': 'Rugrel@321'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in'
    }
    
    try:
        response = requests.post(login_url, json=login_data, headers=headers, timeout=30)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ LOGIN SUCCESSFUL!")
            return True
        else:
            print("❌ Login still failing")
            return False
            
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False

def main():
    print("🚀 EMERGENCY SUPER ADMIN CREATION")
    print("=" * 50)
    
    # First try API creation
    api_success = create_super_admin_via_api()
    
    # Test login regardless
    login_success = test_login_after_creation()
    
    print("\n" + "=" * 50)
    print("📋 RESULTS")
    print("=" * 50)
    
    if login_success:
        print("🎉 SUCCESS! You can now login with:")
        print("   Username: admin@rugrel.in")
        print("   Password: Rugrel@321")
        print("   URL: https://www.rugrel.in/auth/sign-in")
    else:
        print("❌ Login still not working. Need to investigate further.")
        
        # Provide manual Railway commands
        print("\n🔧 MANUAL RAILWAY COMMANDS TO TRY:")
        print("1. railway run bash")
        print("2. python manage.py shell")
        print("3. In shell:")
        print("   from django.contrib.auth import get_user_model")
        print("   User = get_user_model()")
        print("   User.objects.filter(username='admin@rugrel.in').delete()")
        print("   user = User.objects.create_superuser('admin@rugrel.in', 'admin@rugrel.in', 'Rugrel@321')")
        print("   print(f'Created: {user.username}')")

if __name__ == "__main__":
    main()