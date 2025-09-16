#!/usr/bin/env python3
"""
Railway Backend API Debug Script
===============================
Tests the Railway backend API endpoints directly to diagnose login issues
"""

import requests
import json
import sys

# API Configuration
RAILWAY_API_BASE = "https://medixscan-production.up.railway.app"
LOCAL_API_BASE = "http://localhost:8000"

# Super Admin Credentials
SUPER_ADMIN = {
    "email": "tanzeem.agra@rugrel.com",
    "password": "Tanzilla@tanzeem786"
}

def test_api_endpoint(base_url, endpoint, method="GET", data=None, headers=None):
    """Test an API endpoint"""
    url = f"{base_url}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        print(f"✅ {method} {endpoint}: {response.status_code}")
        
        if response.status_code == 200:
            try:
                return response.json()
            except:
                return response.text
        else:
            print(f"   Response: {response.text[:200]}")
            return None
            
    except Exception as e:
        print(f"❌ {method} {endpoint}: Error - {e}")
        return None

def test_railway_backend():
    """Test Railway backend endpoints"""
    print("🚂 Testing Railway Backend API")
    print("=" * 50)
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    # Test basic endpoints
    endpoints = [
        "/ping/",
        "/status/", 
        "/health/",
        "/api/",
    ]
    
    for endpoint in endpoints:
        test_api_endpoint(RAILWAY_API_BASE, endpoint, headers=headers)
    
    # Test authentication endpoints
    print(f"\n🔐 Testing Authentication Endpoints")
    auth_endpoints = [
        "/api/auth/login/",
        "/api/auth/emergency-login/",
        "/api/auth/simple-login/"
    ]
    
    for endpoint in auth_endpoints:
        print(f"\nTesting {endpoint}:")
        result = test_api_endpoint(
            RAILWAY_API_BASE, 
            endpoint, 
            method="POST", 
            data=SUPER_ADMIN,
            headers=headers
        )
        
        if result:
            print(f"   Success: {json.dumps(result, indent=2)}")
            return True
    
    return False

def test_cors_and_headers():
    """Test CORS and headers"""
    print(f"\n🌐 Testing CORS Configuration")
    
    # Test preflight request
    try:
        response = requests.options(
            f"{RAILWAY_API_BASE}/api/auth/login/",
            headers={
                "Origin": "https://www.rugrel.in",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=10
        )
        
        print(f"OPTIONS request: {response.status_code}")
        print("CORS Headers:")
        for header, value in response.headers.items():
            if 'cors' in header.lower() or 'access-control' in header.lower():
                print(f"   {header}: {value}")
                
    except Exception as e:
        print(f"❌ CORS test error: {e}")

def test_database_connection():
    """Test if super admin exists in database"""
    print(f"\n👤 Testing Super Admin User")
    
    # Try to get user info via API
    try:
        # Test if we can get some user info
        response = requests.get(
            f"{RAILWAY_API_BASE}/api/auth/login/",
            timeout=10
        )
        print(f"Auth endpoint accessible: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Database connection test error: {e}")

def main():
    """Main test function"""
    print("🔍 Railway Backend Diagnosis")
    print("=" * 60)
    
    # Test Railway backend
    login_success = test_railway_backend()
    
    # Test CORS
    test_cors_and_headers()
    
    # Test database
    test_database_connection()
    
    print("\n" + "=" * 60)
    
    if login_success:
        print("✅ Backend API is working - issue might be in frontend")
        print("🔧 Check frontend console for detailed error logs")
        print("🔧 Verify form data is being sent correctly")
    else:
        print("❌ Backend API has issues")
        print("🔧 Check Railway logs for errors")
        print("🔧 Verify super admin user exists in database")
    
    print(f"\n🔗 Test URLs:")
    print(f"   Backend: {RAILWAY_API_BASE}")
    print(f"   Frontend: https://www.rugrel.in")
    print(f"   Login: https://www.rugrel.in/auth/sign-in")

if __name__ == "__main__":
    main()