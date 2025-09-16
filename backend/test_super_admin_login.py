#!/usr/bin/env python3

import os
import sys
import django
import requests
import json

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Initialize Django
django.setup()

from django.contrib.auth import get_user_model, authenticate
from django.test.client import Client
from django.urls import reverse

User = get_user_model()

def test_django_authentication():
    print("=== Testing Django Authentication ===")
    
    try:
        # Test direct Django authentication
        user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
        if user:
            print(f"✅ Django authenticate() successful!")
            print(f"   User: {user.username}")
            print(f"   Is Active: {user.is_active}")
            print(f"   Is Superuser: {user.is_superuser}")
        else:
            print("❌ Django authenticate() failed!")
            
            # Check if user exists but password is wrong
            user = User.objects.filter(username='admin@rugrel.in').first()
            if user:
                print(f"   User exists but password check failed")
                print(f"   User password hash: {user.password[:50]}...")
                
                # Try to check password directly
                if user.check_password('Rugrel@321'):
                    print("   ✅ Password check_password() method works")
                else:
                    print("   ❌ Password check_password() method failed")
                    
    except Exception as e:
        print(f"❌ Error in Django authentication: {e}")
        import traceback
        traceback.print_exc()

def test_api_login_local():
    print("\n=== Testing API Login (Local) ===")
    
    try:
        # Test login via API endpoint
        login_url = "http://localhost:8000/api/auth/login/"
        login_data = {
            'email': 'admin@rugrel.in',
            'password': 'Rugrel@321'
        }
        
        response = requests.post(login_url, json=login_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Local API login successful!")
        else:
            print("❌ Local API login failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Local server not running")
    except Exception as e:
        print(f"❌ Error in local API test: {e}")

def test_api_login_production():
    print("\n=== Testing API Login (Production) ===")
    
    try:
        # Test login via Railway API endpoint
        login_url = "https://medixscan-production.up.railway.app/api/auth/login/"
        login_data = {
            'email': 'admin@rugrel.in',
            'password': 'Rugrel@321'
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Origin': 'https://www.rugrel.in'
        }
        
        response = requests.post(login_url, json=login_data, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Production API login successful!")
            try:
                data = response.json()
                if 'access_token' in data or 'token' in data:
                    print("✅ Authentication token received!")
            except:
                pass
        else:
            print("❌ Production API login failed!")
            
    except Exception as e:
        print(f"❌ Error in production API test: {e}")

def reset_user_password():
    print("\n=== Resetting User Password ===")
    
    try:
        user = User.objects.get(username='admin@rugrel.in')
        user.set_password('Rugrel@321')
        user.save()
        print("✅ Password reset successful!")
        
        # Test authentication again
        auth_user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
        if auth_user:
            print("✅ Authentication works after password reset!")
        else:
            print("❌ Authentication still fails after password reset!")
            
    except Exception as e:
        print(f"❌ Error resetting password: {e}")

if __name__ == "__main__":
    test_django_authentication()
    test_api_login_local()
    test_api_login_production()
    
    # If Django auth fails, try resetting password
    user = authenticate(username='admin@rugrel.in', password='Rugrel@321')
    if not user:
        reset_user_password()
        test_django_authentication()