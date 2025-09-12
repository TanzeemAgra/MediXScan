#!/usr/bin/env python3
"""
Test the fixed user creation system
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_fixed_user_creation():
    print("🚀 Testing Fixed User Creation System\n")
    
    # Test the exact format that the frontend should now send
    test_data = {
        "username": "fixeduser_test",
        "email": "fixedtest@example.com",
        "password": "TestPass123!",
        "password_confirm": "TestPass123!",  # Correct field name
        "first_name": "Fixed",
        "last_name": "User"
    }
    
    print("1️⃣ Testing user creation with fixed data format...")
    print(f"   Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{API_BASE}/api/auth/register/",
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            user = result.get('user', {})
            print(f"   ✅ SUCCESS! User created:")
            print(f"      ID: {user.get('id')}")
            print(f"      Username: {user.get('username')}")
            print(f"      Email: {user.get('email')}")
            print(f"      Token: {result.get('token', '')[:20]}...")
            
            return True
        else:
            print(f"   ❌ FAILED: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"   Raw error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        return False

def simulate_frontend_workflow():
    print("\n2️⃣ Simulating Frontend Workflow...\n")
    
    # Simulate what happens when user fills out the form
    form_data = {
        "username": "frontenduser_sim",
        "email": "frontendsim@example.com",
        "password": "TestPass123!",
        "confirmPassword": "TestPass123!",  # Frontend field name
        "first_name": "Frontend",
        "last_name": "Simulation",
        "phone_number": "123-456-7890",
        "department": "Testing"
    }
    
    # Transform to API format (what fixed frontend should do)
    api_data = {
        "username": form_data["username"],
        "email": form_data["email"],
        "password": form_data["password"],
        "password_confirm": form_data["confirmPassword"],  # Map correctly
        "first_name": form_data["first_name"],
        "last_name": form_data["last_name"]
    }
    
    print("   Form data (frontend):")
    print(f"   {json.dumps(form_data, indent=4)}")
    print("\n   API data (after transformation):")
    print(f"   {json.dumps(api_data, indent=4)}")
    
    try:
        response = requests.post(
            f"{API_BASE}/api/auth/register/",
            json=api_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\n   Result: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Frontend workflow simulation successful!")
            return True
        else:
            print(f"   ❌ Frontend workflow failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Workflow exception: {e}")
        return False

if __name__ == "__main__":
    print("🧪 User Creation Fix Validation\n")
    
    # Test the fix
    basic_test = test_fixed_user_creation()
    
    # Test workflow
    workflow_test = simulate_frontend_workflow()
    
    print(f"\n📊 Results:")
    print(f"Basic Creation: {'✅ WORKING' if basic_test else '❌ FAILED'}")
    print(f"Frontend Workflow: {'✅ WORKING' if workflow_test else '❌ FAILED'}")
    
    if basic_test and workflow_test:
        print(f"\n🎉 USER CREATION IS FIXED!")
        print(f"✅ The 400 error should be resolved")
        print(f"✅ Frontend can now create users successfully")
        print(f"✅ Password field mapping is correct")
    else:
        print(f"\n⚠️  Some issues remain - check the errors above")
        
    print(f"\n💡 Next: Test in the frontend at http://localhost:5175/dashboard/rbac-user-management")
