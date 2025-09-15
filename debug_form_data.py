#!/usr/bin/env python3
"""
🔍 FORM DATA DEBUG TEST
Test form submission with exact user credentials
"""

import requests

def test_exact_user_scenario():
    """Test with the exact credentials from the browser logs"""
    print("🔍 EXACT USER SCENARIO TEST")
    print("=" * 50)
    
    # The user tried: dr***@gmail.com
    # Let's test both the working credentials and what they might be trying
    
    test_cases = [
        {
            "name": "Working credentials (confirmed)",
            "email": "tanzeem.agra@rugrel.com",
            "password": "Tanzilla@tanzeem786"
        },
        {
            "name": "Possible user credentials 1", 
            "email": "dr.tanzeem@gmail.com",
            "password": "Tanzilla@tanzeem786"
        },
        {
            "name": "Possible user credentials 2",
            "email": "drtanzeem@gmail.com", 
            "password": "Tanzilla@tanzeem786"
        }
    ]
    
    working_endpoint = "https://medixscan-production.up.railway.app/api/auth/emergency-login/"
    
    for test_case in test_cases:
        print(f"\n🔑 Testing: {test_case['name']}")
        print(f"   Email: {test_case['email']}")
        
        try:
            response = requests.post(
                working_endpoint,
                json={
                    "email": test_case["email"],
                    "password": test_case["password"]
                },
                headers={
                    "Content-Type": "application/json",
                    "Origin": "https://www.rugrel.in"
                },
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ SUCCESS! This email works")
                try:
                    data = response.json()
                    if 'token' in data:
                        print(f"   🎉 Token received: {data['token'][:20]}...")
                except:
                    print(f"   📝 Response: {response.text[:100]}")
            else:
                print(f"   ❌ Response: {response.text[:200]}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def main():
    print("🔍 DEBUGGING USER LOGIN ISSUE")
    print("Testing different email variations...")
    print()
    
    test_exact_user_scenario()
    
    print(f"\n🎯 INSTRUCTIONS:")
    print(f"1. Try the new debugging URL: https://frontend-5zu079z1f-xerxezs-projects.vercel.app/auth/sign-in")
    print(f"2. Use: tanzeem.agra@rugrel.com / Tanzilla@tanzeem786")
    print(f"3. Check browser console for detailed debugging info")
    print(f"4. If using different email, make sure it exists in Railway database")

if __name__ == "__main__":
    main()