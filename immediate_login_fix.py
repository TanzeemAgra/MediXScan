#!/usr/bin/env python3
"""
🚨 IMMEDIATE LOGIN FIX - No More Network Errors
Direct fix for the authentication issue
"""

import requests
import json

def test_current_endpoints():
    """Test what's actually happening right now"""
    print("🔍 CURRENT ENDPOINT ANALYSIS")
    print("=" * 50)
    
    # Test the exact URLs your frontend is trying to reach
    test_urls = [
        "https://medixscan-production.up.railway.app/api/auth/emergency-login/",
        "https://api.rugrel.in/api/auth/emergency-login/",
        "https://medixscan-production.up.railway.app/api/auth/login/",
    ]
    
    credentials = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    working_endpoint = None
    
    for url in test_urls:
        print(f"\n🔗 Testing: {url}")
        try:
            response = requests.post(
                url,
                json=credentials,
                headers={
                    "Content-Type": "application/json",
                    "Origin": "https://medixscan-git-main-xerxezs-projects.vercel.app",
                    "Accept": "application/json"
                },
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ WORKING! Token received")
                working_endpoint = url
                break
            else:
                print(f"   Response: {response.text[:100]}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return working_endpoint

def get_frontend_fix():
    """Generate the exact frontend fix needed"""
    
    working_endpoint = test_current_endpoints()
    
    if working_endpoint:
        print(f"\n🎯 SOLUTION FOUND!")
        print(f"Working endpoint: {working_endpoint}")
        
        # Extract the endpoint path
        if "/auth/emergency-login/" in working_endpoint:
            endpoint_path = "/auth/emergency-login/"
        elif "/auth/login/" in working_endpoint:
            endpoint_path = "/auth/login/"
        else:
            endpoint_path = "/auth/emergency-login/"
        
        # Generate the exact fix
        print(f"\n🔧 EXACT FIX NEEDED:")
        print(f"1. Update your frontend to ONLY use: {working_endpoint}")
        print(f"2. Change login data format to use 'email' field")
        print(f"3. Use endpoint: {endpoint_path}")
        
        return {
            "working_url": working_endpoint,
            "endpoint": endpoint_path,
            "base_url": working_endpoint.replace(endpoint_path, ""),
            "field_format": "email"
        }
    else:
        print(f"\n❌ NO WORKING ENDPOINTS FOUND")
        print(f"Railway backend needs to be redeployed or fixed")
        return None

if __name__ == "__main__":
    print("🚨 IMMEDIATE LOGIN FIX ANALYZER")
    print("Finding the exact working endpoint...")
    print()
    
    fix_info = get_frontend_fix()
    
    if fix_info:
        print(f"\n✅ COPY THIS EXACT FIX:")
        print(f"Base URL: {fix_info['base_url']}")
        print(f"Endpoint: {fix_info['endpoint']}")
        print(f"Field format: {fix_info['field_format']}")
    else:
        print(f"\n🔥 BACKEND PROBLEM - Need to check Railway service")