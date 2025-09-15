#!/usr/bin/env python3
"""
🔄 POST-DEPLOYMENT LOGIN TEST
Test login after Railway backend deployment
"""

import requests
import time
import json

def test_post_deployment_login():
    print("🔄 POST-DEPLOYMENT LOGIN TEST")
    print("=" * 50)
    
    # Wait for deployment to complete
    print("⏳ Waiting 30 seconds for Railway deployment to complete...")
    time.sleep(30)
    
    credentials = {
        "username": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    # Test both Railway URLs
    test_urls = [
        "https://medixscan-production.up.railway.app/api",
        "https://api.rugrel.in/api"
    ]
    
    endpoints = ["/auth/emergency-login/", "/auth/login/"]
    
    for base_url in test_urls:
        print(f"\n🌐 Testing: {base_url}")
        
        for endpoint in endpoints:
            url = f"{base_url}{endpoint}"
            print(f"🔑 Testing: {endpoint}")
            
            try:
                response = requests.post(
                    url,
                    json=credentials,
                    headers={
                        "Content-Type": "application/json",
                        "Origin": "https://medixscan-git-main-xerxezs-projects.vercel.app"
                    },
                    timeout=15
                )
                
                print(f"   Status: {response.status_code}")
                
                if response.status_code == 200:
                    print(f"   ✅ SUCCESS! Login working")
                    try:
                        data = response.json()
                        if 'token' in data:
                            print(f"   🎉 Token received: {data['token'][:20]}...")
                    except:
                        pass
                elif response.status_code == 400:
                    print(f"   ⚠️ 400: {response.text[:100]}")
                elif response.status_code == 404:
                    print(f"   ❌ 404: Endpoint not found")
                else:
                    print(f"   ⚠️ {response.status_code}: {response.text[:100]}")
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
    
    print(f"\n🎯 NEXT STEP:")
    print(f"If you see ✅ SUCCESS above, try logging in at:")
    print(f"https://medixscan-git-main-xerxezs-projects.vercel.app/auth/sign-in")

if __name__ == "__main__":
    test_post_deployment_login()