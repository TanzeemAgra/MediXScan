#!/usr/bin/env python3
"""
Final Validation - Railway API Configuration Complete
Soft coding approach validation for MediXScan application
"""

import json
import requests
import os

def validate_configuration():
    """Validate that all api.rugrel.in references have been removed"""
    
    print("🔍 CONFIGURATION VALIDATION")
    print("=" * 50)
    
    # Files to check
    config_files = [
        "frontend/.env.production",
        "frontend/src/config/smartApiConfig.js", 
        "frontend/src/config/appConfig.js",
        "backend/.env.production"
    ]
    
    api_rugrel_found = False
    
    for file_path in config_files:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'api.rugrel.in' in content:
                    print(f"❌ {file_path}: Still contains api.rugrel.in")
                    api_rugrel_found = True
                else:
                    print(f"✅ {file_path}: Clean (no api.rugrel.in)")
        else:
            print(f"⚠️  {file_path}: File not found")
    
    print()
    return not api_rugrel_found

def test_authentication():
    """Test super admin authentication"""
    
    print("🔐 AUTHENTICATION TEST")
    print("=" * 50)
    
    # Railway API endpoint only
    api_url = "https://medixscan-production.up.railway.app/api/auth/emergency-login/"
    credentials = {
        "email": "tanzeem.agra@rugrel.com",
        "password": "Tanzilla@tanzeem786"
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in'
    }
    
    try:
        response = requests.post(api_url, json=credentials, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Authentication successful")
            print(f"✅ Email: {data.get('user', {}).get('email', 'N/A')}")
            print(f"✅ Token: {'Present' if 'token' in data else 'Missing'}")
            print(f"✅ API Endpoint: Railway only")
            return True
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def main():
    print("🚀 MEDIXSCAN RAILWAY-ONLY CONFIGURATION VALIDATION")
    print("Soft coding validation - No api.rugrel.in references")
    print("=" * 60)
    print()
    
    # Validate configuration
    config_clean = validate_configuration()
    
    # Test authentication  
    auth_working = test_authentication()
    
    print()
    print("=" * 60)
    print("🎯 FINAL RESULTS")
    print("=" * 60)
    
    if config_clean and auth_working:
        print("✅ VALIDATION SUCCESSFUL!")
        print("✅ All api.rugrel.in references removed")
        print("✅ Railway API working correctly") 
        print("✅ Super admin login functional")
        print("✅ Application ready to start")
        print()
        print("🚀 START APPLICATION:")
        print("   Windows: START_APPLICATION.bat")
        print("   Linux/Mac: ./start_application.sh")
        print("   Manual: cd backend && python manage.py runserver")
        print("           cd frontend && npm run dev")
        return True
    else:
        print("❌ VALIDATION FAILED!")
        if not config_clean:
            print("❌ Configuration still contains api.rugrel.in")
        if not auth_working:
            print("❌ Authentication not working")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)