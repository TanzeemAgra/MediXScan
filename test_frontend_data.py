#!/usr/bin/env python3
"""
Test the exact data format that the frontend is sending
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_frontend_simulation():
    print("🔍 Simulating Frontend User Creation Data\n")
    
    # Simulate the exact data format the frontend might be sending
    frontend_data_formats = [
        {
            "name": "Clean Registration Data (What should work)",
            "data": {
                "username": "testuser_clean",
                "email": "testclean@example.com",
                "password": "TestPass123!",
                "password_confirm": "TestPass123!",
                "first_name": "Test",
                "last_name": "User"
            }
        },
        {
            "name": "Full Form Data (What frontend might send)",
            "data": {
                "username": "testuser_full",
                "email": "testfull@example.com",
                "password": "TestPass123!",
                "password_confirm": "TestPass123!",
                "first_name": "Test",
                "last_name": "User",
                "phone_number": "123-456-7890",
                "employee_id": "EMP001",
                "department": "IT",
                "is_active": True,
                "is_approved": True,
                "send_welcome_email": True,
                "require_password_change": False,
                "roles": [],
                "custom_permissions": [],
                "two_factor_enabled": False,
                "session_timeout": 480,
                "allowed_ip_ranges": "",
                "login_time_restrictions": "",
                "profile_picture": None,
                "bio": "",
                "timezone": "UTC",
                "language": "en",
                "email_notifications": True,
                "sms_notifications": False,
                "desktop_notifications": True
            }
        },
        {
            "name": "Form Data with confirmPassword",
            "data": {
                "username": "testuser_confirm",
                "email": "testconfirm@example.com",
                "password": "TestPass123!",
                "confirmPassword": "TestPass123!",  # Frontend field name
                "first_name": "Test",
                "last_name": "User"
            }
        },
        {
            "name": "Missing password_confirm",
            "data": {
                "username": "testuser_missing",
                "email": "testmissing@example.com",
                "password": "TestPass123!",
                "first_name": "Test",
                "last_name": "User"
            }
        }
    ]
    
    for i, test_case in enumerate(frontend_data_formats, 1):
        print(f"{i}️⃣ Testing: {test_case['name']}")
        print(f"   Data keys: {list(test_case['data'].keys())}")
        
        try:
            response = requests.post(
                f"{API_BASE}/api/auth/register/",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 201:
                print(f"   ✅ SUCCESS!")
                result = response.json()
                print(f"   User ID: {result.get('user', {}).get('id')}")
            elif response.status_code == 400:
                print(f"   ❌ BAD REQUEST")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=4)}")
                except:
                    print(f"   Raw error: {response.text[:200]}")
            else:
                print(f"   ⚠️  Other status: {response.text[:100]}")
                
        except Exception as e:
            print(f"   ❌ Exception: {e}")
        
        print()

def check_required_fields():
    print("🔍 Testing Required Field Validation\n")
    
    # Test with missing required fields
    missing_field_tests = [
        {"name": "Missing username", "data": {"email": "test@example.com", "password": "TestPass123!", "password_confirm": "TestPass123!"}},
        {"name": "Missing email", "data": {"username": "testuser", "password": "TestPass123!", "password_confirm": "TestPass123!"}},
        {"name": "Missing password", "data": {"username": "testuser", "email": "test@example.com", "password_confirm": "TestPass123!"}},
        {"name": "Missing password_confirm", "data": {"username": "testuser", "email": "test@example.com", "password": "TestPass123!"}},
        {"name": "Password mismatch", "data": {"username": "testuser", "email": "test@example.com", "password": "TestPass123!", "password_confirm": "DifferentPass123!"}},
    ]
    
    for test_case in missing_field_tests:
        print(f"🧪 {test_case['name']}...")
        
        try:
            response = requests.post(
                f"{API_BASE}/api/auth/register/",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            print(f"   Status: {response.status_code}")
            if response.status_code == 400:
                try:
                    error_data = response.json()
                    print(f"   Expected error: {error_data}")
                except:
                    print(f"   Raw error: {response.text[:100]}")
            elif response.status_code == 201:
                print(f"   ⚠️  Unexpected success (validation issue?)")
                
        except Exception as e:
            print(f"   Exception: {e}")
        
        print()

if __name__ == "__main__":
    print("🚀 Frontend Data Format Testing\n")
    
    # Test different data formats
    test_frontend_simulation()
    
    # Test required field validation
    check_required_fields()
    
    print("💡 Analysis complete. Check which format works and fix frontend accordingly.")
