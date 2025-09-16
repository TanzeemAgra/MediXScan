#!/usr/bin/env python3

import requests
import json

def test_production_api_database():
    print("=== Testing Production API Database Connection ===")
    
    # First, let's test a simple API endpoint to see if the server is running
    base_url = "https://medixscan-production.up.railway.app"
    
    # Test health endpoint
    try:
        health_response = requests.get(f"{base_url}/health/", timeout=10)
        print(f"Health check: {health_response.status_code} - {health_response.text}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    # Test admin panel access
    try:
        admin_response = requests.get(f"{base_url}/admin/", timeout=10)
        print(f"Admin panel: {admin_response.status_code}")
    except Exception as e:
        print(f"Admin panel failed: {e}")
    
    # Test if we can get user count or any user-related endpoint
    endpoints_to_test = [
        "/api/auth/",
        "/api/users/",
        "/api/accounts/",
        "/api/",
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            print(f"{endpoint}: {response.status_code} - {response.text[:100]}...")
        except Exception as e:
            print(f"{endpoint}: ERROR - {str(e)[:50]}...")
    
    # Test with different user that we know exists
    print("\n=== Testing with tanzeem_admin user ===")
    
    login_data = {
        'email': 'tanzeem.agra@rugrel.com',
        'password': 'StrongPassword123!'  # Default password for tanzeem_admin
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/auth/login/",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Tanzeem login: {response.status_code} - {response.text}")
        
    except Exception as e:
        print(f"Tanzeem login failed: {e}")

if __name__ == "__main__":
    test_production_api_database()