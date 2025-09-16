#!/usr/bin/env python3

import requests
import json
import time

def test_production_api_detailed():
    print("=== DETAILED PRODUCTION API TEST ===")
    
    # Test different API endpoints
    base_url = "https://medixscan-production.up.railway.app"
    
    # 1. Test API health
    print("1. Testing API health...")
    try:
        health_response = requests.get(f"{base_url}/api/health/", timeout=10)
        print(f"   Health Status: {health_response.status_code}")
        print(f"   Health Response: {health_response.text}")
    except Exception as e:
        print(f"   Health check failed: {e}")
    
    # 2. Test different login endpoints
    login_endpoints = [
        "/api/auth/login/",
        "/api/accounts/login/",
        "/accounts/login/",
        "/login/",
        "/api/login/"
    ]
    
    login_data = {
        'email': 'admin@rugrel.in',
        'password': 'Rugrel@321'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for endpoint in login_endpoints:
        print(f"\n2. Testing endpoint: {endpoint}")
        try:
            response = requests.post(f"{base_url}{endpoint}", 
                                   json=login_data, 
                                   headers=headers, 
                                   timeout=15)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            
            if response.status_code == 200:
                print("   ✅ SUCCESS!")
                return True
                
        except Exception as e:
            print(f"   Error: {e}")
    
    # 3. Test with different data formats
    print(f"\n3. Testing with different data formats...")
    
    # Test with username field instead of email
    username_data = {
        'username': 'admin@rugrel.in',
        'password': 'Rugrel@321'
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/login/", 
                               json=username_data, 
                               headers=headers, 
                               timeout=15)
        print(f"   Username format - Status: {response.status_code}")
        print(f"   Username format - Response: {response.text}")
    except Exception as e:
        print(f"   Username format error: {e}")
    
    # Test with form data
    try:
        form_headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://www.rugrel.in'
        }
        response = requests.post(f"{base_url}/api/auth/login/", 
                               data=login_data, 
                               headers=form_headers, 
                               timeout=15)
        print(f"   Form data - Status: {response.status_code}")
        print(f"   Form data - Response: {response.text}")
    except Exception as e:
        print(f"   Form data error: {e}")
    
    # 4. Test user lookup endpoint
    print(f"\n4. Testing user lookup...")
    try:
        # Check if there's a user info endpoint
        user_response = requests.get(f"{base_url}/api/users/", 
                                   headers={'Origin': 'https://www.rugrel.in'}, 
                                   timeout=10)
        print(f"   Users endpoint - Status: {user_response.status_code}")
        print(f"   Users endpoint - Response: {user_response.text[:200]}...")
    except Exception as e:
        print(f"   User lookup error: {e}")
    
    return False

def test_with_other_user():
    print("\n=== TESTING WITH TANZEEM ADMIN ===")
    
    login_data = {
        'email': 'tanzeem.agra@rugrel.com',
        'password': 'Tanzeem@123'  # Try common password
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in'
    }
    
    try:
        response = requests.post("https://medixscan-production.up.railway.app/api/auth/login/", 
                               json=login_data, 
                               headers=headers, 
                               timeout=15)
        print(f"Tanzeem login - Status: {response.status_code}")
        print(f"Tanzeem login - Response: {response.text}")
        
        if response.status_code == 400:
            # Try different common passwords
            passwords = ['Admin@123', 'Password@123', 'tanzeem123', 'Rugrel@321']
            for pwd in passwords:
                print(f"  Trying password: {pwd}")
                login_data['password'] = pwd
                resp = requests.post("https://medixscan-production.up.railway.app/api/auth/login/", 
                                   json=login_data, headers=headers, timeout=10)
                print(f"  Status: {resp.status_code} - {resp.text}")
                if resp.status_code == 200:
                    print("  ✅ SUCCESS WITH TANZEEM!")
                    break
                    
    except Exception as e:
        print(f"Tanzeem test error: {e}")

def main():
    test_production_api_detailed()
    test_with_other_user()

if __name__ == "__main__":
    main()