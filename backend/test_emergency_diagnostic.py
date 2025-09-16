#!/usr/bin/env python3

import requests
import json

def test_emergency_diagnostic():
    """Test the emergency diagnostic API to identify production issues"""
    
    print("=== EMERGENCY DIAGNOSTIC TEST ===")
    
    base_url = "https://medixscan-production.up.railway.app/api/auth"
    
    # Test 1: Get diagnostic information
    print("\n1. Testing Emergency Diagnostic API...")
    try:
        response = requests.get(f"{base_url}/emergency/diagnostic/", timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Diagnostic API working!")
            print(f"Database connected: {data.get('database_connected')}")
            print(f"Total users: {data.get('total_users')}")
            print(f"Superuser count: {data.get('superuser_count')}")
            print(f"Admin user exists: {data.get('admin_user_exists')}")
            
            if data.get('admin_user_details'):
                admin = data['admin_user_details']
                print(f"Admin details: ID={admin['id']}, Active={admin['is_active']}, Super={admin['is_superuser']}")
            
            print(f"All users in database:")
            for user in data.get('all_users', []):
                print(f"  - {user['username']} ({user['email']}) - Super: {user['is_superuser']}")
        else:
            print(f"❌ Diagnostic failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Diagnostic API error: {e}")
    
    # Test 2: Force create user
    print("\n2. Testing Emergency User Creation...")
    try:
        create_data = {'action': 'create_user'}
        response = requests.post(
            f"{base_url}/emergency/diagnostic/",
            json=create_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"Create user status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ User creation successful!")
            print(f"User ID: {data.get('user_id')}")
            print(f"Username: {data.get('username')}")
            print(f"Email: {data.get('email')}")
        else:
            print(f"❌ User creation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User creation error: {e}")
    
    # Test 3: Test emergency authentication
    print("\n3. Testing Emergency Authentication...")
    try:
        auth_data = {
            'email': 'admin@rugrel.in',
            'password': 'Rugrel@321'
        }
        
        response = requests.post(
            f"{base_url}/emergency/login-test/",
            json=auth_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"Emergency auth status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Emergency authentication successful!")
            print(f"Access token: {data.get('access_token', 'N/A')[:20]}...")
            print(f"User ID: {data.get('user', {}).get('id')}")
            print(f"Is superuser: {data.get('user', {}).get('is_superuser')}")
        else:
            print(f"❌ Emergency auth failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Emergency auth error: {e}")

if __name__ == "__main__":
    test_emergency_diagnostic()