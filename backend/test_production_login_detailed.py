#!/usr/bin/env python3

import requests
import json

def test_production_login_detailed():
    print("=== Detailed Production Login Test ===")
    
    # Test various combinations
    test_cases = [
        {
            'name': 'Email as username',
            'data': {'email': 'admin@rugrel.in', 'password': 'Rugrel@321'}
        },
        {
            'name': 'Username field',
            'data': {'username': 'admin@rugrel.in', 'password': 'Rugrel@321'}
        },
        {
            'name': 'Both email and username',
            'data': {'email': 'admin@rugrel.in', 'username': 'admin@rugrel.in', 'password': 'Rugrel@321'}
        }
    ]
    
    for test_case in test_cases:
        print(f"\n--- Testing: {test_case['name']} ---")
        
        try:
            url = "https://medixscan-production.up.railway.app/api/auth/login/"
            headers = {
                'Content-Type': 'application/json',
                'Origin': 'https://www.rugrel.in',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.post(url, json=test_case['data'], headers=headers, timeout=30)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Check if there are any informative headers
            if 'X-Debug' in response.headers:
                print(f"Debug Info: {response.headers['X-Debug']}")
                
        except Exception as e:
            print(f"Error: {e}")

def test_user_check_endpoint():
    print("\n=== Testing User Check Endpoint ===")
    
    try:
        # Check if there's a user list or info endpoint
        url = "https://medixscan-production.up.railway.app/api/auth/user/admin@rugrel.in/"
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://www.rugrel.in'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        print(f"User Check Status: {response.status_code}")
        print(f"User Check Response: {response.text}")
        
    except Exception as e:
        print(f"User check error: {e}")

def test_direct_user_creation():
    print("\n=== Testing Direct User Creation via API ===")
    
    try:
        # Try to create user via registration endpoint
        url = "https://medixscan-production.up.railway.app/api/auth/register/"
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://www.rugrel.in'
        }
        
        user_data = {
            'email': 'admin@rugrel.in',
            'username': 'admin@rugrel.in',
            'password': 'Rugrel@321',
            'first_name': 'Admin',
            'last_name': 'Rugrel'
        }
        
        response = requests.post(url, json=user_data, headers=headers, timeout=30)
        print(f"Registration Status: {response.status_code}")
        print(f"Registration Response: {response.text}")
        
    except Exception as e:
        print(f"Registration error: {e}")

if __name__ == "__main__":
    test_production_login_detailed()
    test_user_check_endpoint()
    test_direct_user_creation()