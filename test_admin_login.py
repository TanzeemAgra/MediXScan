#!/usr/bin/env python3
"""
Test different login formats for admin access
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_admin_login_formats():
    print("🔄 Testing different admin login formats...\n")
    
    # Different login formats to try
    login_formats = [
        {"endpoint": "/api/auth/login/", "data": {"username": "admin", "password": "admin123"}},
        {"endpoint": "/api/auth/login/", "data": {"email": "admin@radiology.com", "password": "admin123"}},  
        {"endpoint": "/api/auth/token/", "data": {"username": "admin", "password": "admin123"}},
        {"endpoint": "/api/token/", "data": {"username": "admin", "password": "admin123"}},
        {"endpoint": "/auth/login/", "data": {"username": "admin", "password": "admin123"}},
    ]
    
    for i, config in enumerate(login_formats, 1):
        print(f"{i}️⃣ Trying {config['endpoint']} with username/password...")
        
        try:
            response = requests.post(
                f"{API_BASE}{config['endpoint']}",
                json=config['data'],
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                if 'token' in data:
                    print(f"   ✅ Success! Token received: {data['token'][:20]}...")
                    return data['token'], config['endpoint']
                else:
                    print(f"   ⚠️  Success but no token in response")
            else:
                print(f"   ❌ Failed: {response.text[:100]}")
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)[:50]}")
        
        print()
    
    return None, None

def test_token_auth(token):
    print(f"🔄 Testing token authentication...")
    
    headers = {'Authorization': f'Token {token}'}
    
    # Test endpoints
    test_endpoints = [
        '/api/auth/users/',
        '/api/auth/profile/',
        '/api/accounts/users/',
    ]
    
    for endpoint in test_endpoints:
        try:
            response = requests.get(f"{API_BASE}{endpoint}", headers=headers, timeout=5)
            print(f"  {endpoint}: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"    ✅ Got {len(data)} items")
                else:
                    print(f"    ✅ Got response data")
                return True
                
        except Exception as e:
            print(f"  {endpoint}: Error - {e}")
    
    return False

if __name__ == "__main__":
    print("🚀 Admin Login Format Testing\n")
    
    # Test login formats
    token, endpoint = test_admin_login_formats()
    
    if token:
        print(f"✅ Login successful with {endpoint}")
        
        # Test token usage
        auth_ok = test_token_auth(token)
        
        if auth_ok:
            print(f"\n🎉 Admin authentication fully working!")
            print(f"💡 Use these credentials in frontend:")
            print(f"   Username: admin")
            print(f"   Password: admin123")
        else:
            print(f"\n⚠️  Token received but API access limited")
    else:
        print(f"\n❌ No working login endpoint found")
        print(f"💡 Check Django authentication configuration")
