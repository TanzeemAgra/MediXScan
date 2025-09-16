#!/usr/bin/env python3
"""
Check what endpoints are available on the Railway backend
"""

import requests
import json

def check_backend_endpoints():
    """Check what endpoints are available"""
    
    base_url = "https://medixscan-production.up.railway.app"
    
    # Test various endpoints to see what exists
    test_endpoints = [
        "/",
        "/api/",
        "/admin/",
        "/auth/",
        "/accounts/",
        "/login/",
        "/api/auth/",
        "/api/login/",
        "/health/",
        "/status/"
    ]
    
    print(f"🔍 CHECKING AVAILABLE ENDPOINTS ON: {base_url}")
    print("=" * 60)
    
    for endpoint in test_endpoints:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=10)
            
            print(f"📍 {endpoint:20} | Status: {response.status_code:3d} | Content-Type: {response.headers.get('Content-Type', 'unknown')}")
            
            if response.status_code == 200:
                print(f"✅ FOUND: {endpoint}")
                
        except Exception as e:
            print(f"📍 {endpoint:20} | ERROR: {e}")

if __name__ == '__main__':
    check_backend_endpoints()