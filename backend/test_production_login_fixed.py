#!/usr/bin/env python3

import requests
import json

def test_production_login_fixed():
    print("=== Testing Production Login API (Fixed) ===")
    
    # Test with the correct production API
    login_url = "https://medixscan-production.up.railway.app/api/auth/login/"
    
    login_data = {
        'email': 'admin@rugrel.in',
        'password': 'Rugrel@321'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"Sending request to: {login_url}")
        print(f"Payload: {json.dumps(login_data, indent=2)}")
        
        response = requests.post(
            login_url, 
            json=login_data, 
            headers=headers, 
            timeout=30
        )
        
        print(f"\n=== Response ===")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Response JSON: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 200:
                print("\n✅ LOGIN SUCCESSFUL!")
                if 'access_token' in response_data or 'token' in response_data:
                    print("✅ Authentication token received!")
                    return True
                else:
                    print("⚠️ No token in response")
            else:
                print(f"\n❌ LOGIN FAILED: {response_data}")
                
        except json.JSONDecodeError:
            print(f"Raw Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request Error: {e}")
        import traceback
        traceback.print_exc()
        
    return False

def test_alternative_endpoints():
    print("\n=== Testing Alternative Login Endpoints ===")
    
    # Test different possible endpoints
    endpoints = [
        "https://medixscan-production.up.railway.app/api/auth/login/",
        "https://medixscan-production.up.railway.app/auth/login/",
        "https://medixscan-production.up.railway.app/api/login/",
        "https://medixscan-production.up.railway.app/login/"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.post(
                endpoint,
                json={'email': 'admin@rugrel.in', 'password': 'Rugrel@321'},
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            print(f"{endpoint}: {response.status_code} - {response.text[:100]}...")
        except Exception as e:
            print(f"{endpoint}: ERROR - {str(e)[:50]}...")

if __name__ == "__main__":
    success = test_production_login_fixed()
    
    if not success:
        test_alternative_endpoints()