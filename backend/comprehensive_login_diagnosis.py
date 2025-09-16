#!/usr/bin/env python3

import requests
import json
import os
import sys
import django

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configure Django settings for local database check
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

def test_production_login():
    print("=== Testing Production Login API ===")
    
    # Test login via Railway API endpoint
    login_url = "https://medixscan-production.up.railway.app/api/auth/login/"
    login_data = {
        'email': 'admin@rugrel.in',
        'password': 'Rugrel@321'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'https://www.rugrel.in',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"🔄 Making request to: {login_url}")
        print(f"📤 Request data: {login_data}")
        print(f"📋 Headers: {headers}")
        
        response = requests.post(login_url, json=login_data, headers=headers, timeout=30)
        
        print(f"\n📊 Response Status: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        print(f"📄 Response Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            try:
                data = response.json()
                if 'access_token' in data or 'token' in data:
                    print("✅ Authentication token received!")
                    return True, data
            except:
                pass
        else:
            print("❌ Login failed!")
            try:
                error_data = response.json()
                print(f"🚨 Error details: {error_data}")
                return False, error_data
            except:
                return False, {'error': 'Unknown error', 'response': response.text}
                
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False, {'error': str(e)}

def test_local_database():
    print("\n=== Testing Local Database ===")
    
    try:
        # Initialize Django
        django.setup()
        
        from django.contrib.auth import get_user_model, authenticate
        
        User = get_user_model()
        
        # Check if user exists
        user = User.objects.filter(username='admin@rugrel.in').first()
        if user:
            print(f"✅ User exists: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Staff: {user.is_staff}")
            print(f"   Is Superuser: {user.is_superuser}")
            
            # Test authentication
            auth_user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
            if auth_user:
                print("✅ Local authentication successful!")
                return True
            else:
                print("❌ Local authentication failed!")
                
                # Test password directly
                if user.check_password('Rugrel@321'):
                    print("✅ Password is correct (check_password)")
                else:
                    print("❌ Password is incorrect")
                return False
        else:
            print("❌ User does not exist in local database!")
            return False
            
    except Exception as e:
        print(f"❌ Local database test failed: {e}")
        return False

def test_railway_database():
    print("\n=== Testing Railway Database ===")
    
    # Test Railway database connection
    railway_db_url = "postgresql://postgres:VHNnfKPZAVqYJqSaJRFrVmfYnFyuJrAk@monorail.proxy.rlwy.net:22662/railway"
    
    try:
        # Set Railway database URL
        original_db_url = os.environ.get('DATABASE_URL')
        os.environ['DATABASE_URL'] = railway_db_url
        
        # Re-initialize Django with Railway DB
        from django.core.management import execute_from_command_line
        from django.conf import settings
        
        # Clear Django setup
        if hasattr(django, 'apps'):
            django.apps.apps.clear_cache()
            
        django.setup()
        
        from django.contrib.auth import get_user_model, authenticate
        
        User = get_user_model()
        
        # Check if user exists in Railway
        user = User.objects.filter(username='admin@rugrel.in').first()
        if user:
            print(f"✅ User exists in Railway: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Staff: {user.is_staff}")
            print(f"   Is Superuser: {user.is_superuser}")
            
            # Test authentication against Railway DB
            auth_user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
            if auth_user:
                print("✅ Railway authentication successful!")
                return True
            else:
                print("❌ Railway authentication failed!")
                
                # Test password directly
                if user.check_password('Rugrel@321'):
                    print("✅ Password is correct in Railway DB")
                else:
                    print("❌ Password is incorrect in Railway DB")
                return False
        else:
            print("❌ User does not exist in Railway database!")
            return False
            
    except Exception as e:
        print(f"❌ Railway database test failed: {e}")
        return False
    finally:
        # Restore original database URL
        if original_db_url:
            os.environ['DATABASE_URL'] = original_db_url
        else:
            os.environ.pop('DATABASE_URL', None)

def main():
    print("🔍 COMPREHENSIVE LOGIN DIAGNOSIS")
    print("=" * 50)
    
    # Test production API
    api_success, api_result = test_production_login()
    
    # Test local database
    local_success = test_local_database()
    
    # Test Railway database  
    railway_success = test_railway_database()
    
    print("\n" + "=" * 50)
    print("📋 DIAGNOSIS SUMMARY")
    print("=" * 50)
    
    print(f"🌐 Production API Login: {'✅ SUCCESS' if api_success else '❌ FAILED'}")
    print(f"💾 Local Database Auth: {'✅ SUCCESS' if local_success else '❌ FAILED'}")
    print(f"🚂 Railway Database Auth: {'✅ SUCCESS' if railway_success else '❌ FAILED'}")
    
    if not api_success:
        print(f"\n🚨 API Error: {api_result}")
        
    # Provide recommendations
    print("\n🔧 RECOMMENDATIONS:")
    
    if local_success and not railway_success:
        print("- User exists locally but not on Railway - need to create Railway user")
    elif railway_success and not api_success:
        print("- Railway DB works but API fails - check API endpoint or configuration")
    elif not local_success and not railway_success:
        print("- User missing from both databases - need to create user properly")
    elif api_success:
        print("- All systems working - login should work on frontend")

if __name__ == "__main__":
    main()