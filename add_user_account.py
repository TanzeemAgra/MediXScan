#!/usr/bin/env python3
"""
🔧 ADD NEW USER ACCOUNT
Add dr.tanzeem@gmail.com to Railway database
"""

import requests

def add_user_to_database():
    """Add the user's Gmail account to Railway database"""
    print("🔧 ADDING USER ACCOUNT TO DATABASE")
    print("=" * 50)
    
    # User registration data
    new_user_data = {
        "email": "dr.tanzeem@gmail.com",
        "password": "Tanzilla@tanzeem786",
        "username": "dr.tanzeem",
        "first_name": "Dr",
        "last_name": "Tanzeem",
        "is_approved": True,
        "is_active": True
    }
    
    # Try to register via API
    registration_endpoints = [
        "https://medixscan-production.up.railway.app/api/auth/register/",
        "https://medixscan-production.up.railway.app/api/users/create/",
        "https://medixscan-production.up.railway.app/api/auth/signup/"
    ]
    
    for endpoint in registration_endpoints:
        print(f"\n🔗 Trying: {endpoint}")
        
        try:
            response = requests.post(
                endpoint,
                json=new_user_data,
                headers={
                    "Content-Type": "application/json",
                    "Origin": "https://www.rugrel.in"
                },
                timeout=15
            )
            
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
            if response.status_code in [200, 201]:
                print(f"   ✅ SUCCESS! User created")
                return True
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n❌ Could not register via API endpoints")
    return False

def main():
    print("🔧 USER ACCOUNT MANAGER")
    print("Adding dr.tanzeem@gmail.com to database...")
    print()
    
    success = add_user_to_database()
    
    if success:
        print(f"\n🎉 SUCCESS! You can now login with:")
        print(f"   Email: dr.tanzeem@gmail.com") 
        print(f"   Password: Tanzilla@tanzeem786")
    else:
        print(f"\n⚠️ ALTERNATIVE SOLUTION:")
        print(f"   Use existing account: tanzeem.agra@rugrel.com")
        print(f"   Password: Tanzilla@tanzeem786")
        print(f"   URL: https://frontend-5zu079z1f-xerxezs-projects.vercel.app/auth/sign-in")

if __name__ == "__main__":
    main()