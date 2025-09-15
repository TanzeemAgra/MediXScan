#!/usr/bin/env python3
"""
Railway API Login Test - Soft Coding Validation
Test login with super admin credentials using only Railway API endpoint
"""

import json
import requests
import sys

def test_railway_login():
    """Test login functionality against Railway API only"""
    
    # Soft coding: Use Railway API endpoint exclusively
    RAILWAY_API_BASE = "https://medixscan-production.up.railway.app/api"
    
    # Test endpoints
    endpoints = [
        f"{RAILWAY_API_BASE}/auth/login/",
        f"{RAILWAY_API_BASE}/auth/emergency-login/",
        f"{RAILWAY_API_BASE}/health/"
    ]
    
    # Super admin credentials
    credentials = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    print("🔍 RAILWAY API AUTHENTICATION TEST")
    print("=" * 50)
    print(f"📡 Base URL: {RAILWAY_API_BASE}")
    print(f"👤 Testing with: {credentials['email']}")
    print()
    
    # Test health endpoint first
    try:
        print("🏥 Testing health endpoint...")
        health_response = requests.get(endpoints[2], timeout=10)
        print(f"   Status: {health_response.status_code}")
        if health_response.status_code == 200:
            print("   ✅ Backend is responsive")
        else:
            print("   ❌ Backend health check failed")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    print()
    
    # Test login endpoints
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in',
        'Accept': 'application/json'
    }
    
    for i, endpoint in enumerate(endpoints[:2]):  # Only test login endpoints
        endpoint_name = "Standard Login" if i == 0 else "Emergency Login"
        print(f"🔐 Testing {endpoint_name}...")
        print(f"   Endpoint: {endpoint}")
        
        try:
            response = requests.post(
                endpoint,
                json=credentials,
                headers=headers,
                timeout=15
            )
            
            print(f"   Status Code: {response.status_code}")
            print(f"   Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    print("   ✅ Login successful!")
                    print(f"   Token: {'Present' if 'token' in data else 'Missing'}")
                    print(f"   User: {data.get('user', {}).get('email', 'N/A')}")
                    print(f"   Roles: {data.get('user', {}).get('role_names', 'N/A')}")
                    return True
                except json.JSONDecodeError:
                    print("   ⚠️  Response not JSON format")
            else:
                print(f"   ❌ Login failed: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Request error: {e}")
        
        print()
    
    return False

if __name__ == "__main__":
    print("🚀 RAILWAY API SOFT CODING TEST")
    print("Testing authentication with Railway endpoint only")
    print("No api.rugrel.in references - pure Railway configuration")
    print()
    
    success = test_railway_login()
    
    print("=" * 50)
    if success:
        print("✅ AUTHENTICATION TEST PASSED")
        print("✅ Railway API working correctly")
        print("✅ Super admin login functional")
    else:
        print("❌ AUTHENTICATION TEST FAILED")
        print("❌ Check backend configuration")
        print("❌ Verify Railway deployment")
    
    sys.exit(0 if success else 1)