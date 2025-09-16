#!/usr/bin/env python3
"""
EMERGENCY TEST: Test production authentication API using Python requests
"""

import requests
import json

def test_production_auth():
    """Test the production authentication endpoints"""
    
    base_url = "https://medixscan-production.up.railway.app"
    
    # Test credentials
    credentials = {
        "email": "admin@rugrel.in",
        "password": "Rugrel@321"
    }
    
    print("🚨 EMERGENCY: Testing production authentication")
    print(f"📍 Base URL: {base_url}")
    print(f"👤 Testing credentials: {credentials['email']}")
    
    # Test endpoints in order (correct paths based on URL configuration)
    endpoints = [
        "/api/auth/login/",
        "/api/auth/emergency/diagnostic/", 
        "/api/auth/emergency/login-test/"
    ]
    
    for endpoint in endpoints:
        try:
            url = f"{base_url}{endpoint}"
            print(f"\n🔄 Testing endpoint: {url}")
            
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Emergency-Auth-Test/1.0'
            }
            
            if endpoint == "/accounts/emergency/diagnostic/":
                # GET request for diagnostic
                response = requests.get(url, headers=headers, timeout=30)
            else:
                # POST request for login
                response = requests.post(url, json=credentials, headers=headers, timeout=30)
            
            print(f"📊 Status Code: {response.status_code}")
            print(f"📊 Headers: {dict(response.headers)}")
            
            try:
                data = response.json()
                print(f"📊 Response Data: {json.dumps(data, indent=2)}")
            except:
                print(f"📊 Response Text: {response.text[:500]}...")
                
            if response.status_code == 200:
                print(f"✅ SUCCESS: {endpoint} is working!")
                if 'token' in str(response.text).lower():
                    print("🎉 TOKEN FOUND IN RESPONSE!")
                    return True
            else:
                print(f"❌ FAILED: {endpoint} returned {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ CONNECTION ERROR for {endpoint}: {e}")
        except Exception as e:
            print(f"❌ UNEXPECTED ERROR for {endpoint}: {e}")
    
    return False

if __name__ == '__main__':
    print("🚨 EMERGENCY AUTHENTICATION TEST STARTING")
    print("=" * 50)
    
    success = test_production_auth()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 EMERGENCY TEST RESULT: Authentication system is working!")
    else:
        print("❌ EMERGENCY TEST RESULT: Authentication system needs fixing")