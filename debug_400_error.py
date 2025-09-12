#!/usr/bin/env python3
"""
Debug the 400 error in user creation
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_registration_debug():
    print("🔍 Debugging User Registration 400 Error\n")
    
    # Test with minimal required data first
    test_cases = [
        {
            "name": "Minimal Data",
            "data": {
                "username": "testuser123",
                "email": "test123@example.com",
                "password": "TestPass123!",
                "password_confirm": "TestPass123!"
            }
        },
        {
            "name": "With Names",
            "data": {
                "username": "testuser456",
                "email": "test456@example.com",
                "password": "TestPass123!",
                "password_confirm": "TestPass123!",
                "first_name": "Test",
                "last_name": "User"
            }
        },
        {
            "name": "Backend Format",
            "data": {
                "username": "testuser789",
                "email": "test789@example.com",
                "password": "TestPass123!",
                "confirm_password": "TestPass123!",  # Different confirm field name
                "first_name": "Test",
                "last_name": "User"
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"{i}️⃣ Testing {test_case['name']}...")
        
        try:
            response = requests.post(
                f"{API_BASE}/api/auth/register/",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            
            if response.status_code == 201:
                print(f"   ✅ Success!")
                return test_case['data']
            elif response.status_code == 400:
                print(f"   ❌ Bad Request - checking error details...")
                try:
                    error_data = response.json()
                    print(f"   Error details: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Raw error: {response.text}")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        print()
    
    return None

def check_registration_endpoint():
    print("🔍 Checking registration endpoint configuration...")
    
    # Test GET request to see what fields are expected
    try:
        response = requests.get(f"{API_BASE}/api/auth/register/", timeout=5)
        print(f"GET /api/auth/register/: {response.status_code}")
        if response.status_code == 405:
            print("✅ Endpoint exists (Method Not Allowed for GET is expected)")
        
    except Exception as e:
        print(f"❌ Error checking endpoint: {e}")
    
    # Test OPTIONS request to see allowed methods
    try:
        response = requests.options(f"{API_BASE}/api/auth/register/", timeout=5)
        print(f"OPTIONS /api/auth/register/: {response.status_code}")
        if 'Allow' in response.headers:
            print(f"Allowed methods: {response.headers['Allow']}")
            
    except Exception as e:
        print(f"❌ Error checking options: {e}")

if __name__ == "__main__":
    print("🚀 User Registration 400 Error Debug\n")
    
    # Check endpoint
    check_registration_endpoint()
    print()
    
    # Test different data formats
    working_data = test_registration_debug()
    
    if working_data:
        print(f"✅ Found working format:")
        print(json.dumps(working_data, indent=2))
    else:
        print(f"❌ No working format found")
        print(f"💡 Need to check Django registration view configuration")
