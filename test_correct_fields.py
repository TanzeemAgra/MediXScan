#!/usr/bin/env python3
"""
🔧 FIXED CREDENTIALS TEST
Test with correct field names
"""

import requests
import json

def test_with_correct_fields():
    print("🔧 TESTING WITH CORRECT FIELD NAMES")
    print("=" * 50)
    
    # Try both field name variations
    credentials_variations = [
        {
            "email": "tanzeem.agra@rugrel.com",
            "password": "Tanzilla@tanzeem786"
        },
        {
            "username": "tanzeem.agra@rugrel.com", 
            "password": "Tanzilla@tanzeem786"
        }
    ]
    
    base_url = "https://medixscan-production.up.railway.app/api"
    endpoints = ["/auth/emergency-login/", "/auth/login/"]
    
    for i, creds in enumerate(credentials_variations, 1):
        field_type = "email" if "email" in creds else "username"
        print(f"\n🔑 Test {i}: Using '{field_type}' field")
        
        for endpoint in endpoints:
            url = f"{base_url}{endpoint}"
            print(f"   Testing: {endpoint}")
            
            try:
                response = requests.post(
                    url,
                    json=creds,
                    headers={
                        "Content-Type": "application/json",
                        "Origin": "https://medixscan-git-main-xerxezs-projects.vercel.app"
                    },
                    timeout=15
                )
                
                print(f"      Status: {response.status_code}")
                
                if response.status_code == 200:
                    print(f"      ✅ SUCCESS!")
                    try:
                        data = response.json()
                        if 'token' in data:
                            print(f"      🎉 Token: {data['token'][:20]}...")
                        return True, creds, endpoint
                    except:
                        print(f"      📝 Response: {response.text[:100]}")
                        return True, creds, endpoint
                else:
                    print(f"      ❌ {response.status_code}: {response.text[:100]}")
                    
            except Exception as e:
                print(f"      ❌ Error: {e}")
    
    return False, None, None

def main():
    success, working_creds, working_endpoint = test_with_correct_fields()
    
    if success:
        print(f"\n🎉 FOUND WORKING COMBINATION!")
        print(f"   Credentials: {working_creds}")  
        print(f"   Endpoint: {working_endpoint}")
        print(f"\n✅ Now try logging in at:")
        print(f"   https://medixscan-git-main-xerxezs-projects.vercel.app/auth/sign-in")
    else:
        print(f"\n❌ No working combination found - need to check backend code")

if __name__ == "__main__":
    main()