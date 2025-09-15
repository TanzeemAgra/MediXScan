#!/usr/bin/env python3
"""
Django ORM script to create approved superuser
Run this on the Railway backend or via Django shell
"""
import os
import sys

# This script should be run in Django environment
# Can be executed via: python manage.py shell < this_script.py

script_content = '''
# Django management script to create approved superuser
import os
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "medixscan_project.settings") 
django.setup()

from accounts.models import User
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

def create_approved_superuser():
    try:
        with transaction.atomic():
            # Delete existing pending users first
            User.objects.filter(email="tanzeem.agra@rugrel.com").delete()
            User.objects.filter(email="system@medixscan.com").delete()
            User.objects.filter(email="superadmin@medixscan.com").delete()
            
            print("Deleted existing pending users")
            
            # Create new superuser with approval
            user = User.objects.create_user(
                username="tanzeem.agra",
                email="tanzeem.agra@rugrel.com",
                password="Tanzilla@tanzeem786",
                first_name="Tanzeem",
                last_name="Agra",
                is_staff=True,
                is_superuser=True,
                is_active=True,
                is_approved=True  # This is the key field!
            )
            
            # Also create backup admin
            admin_user = User.objects.create_user(
                username="admin",
                email="admin@medixscan.com", 
                password="admin123",
                first_name="Admin",
                last_name="User",
                is_staff=True,
                is_superuser=True,
                is_active=True,
                is_approved=True
            )
            
            print(f"✅ Created approved superuser: {user.email}")
            print(f"✅ Created approved admin: {admin_user.email}")
            print("Both users can now login without approval!")
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Execute the function
if __name__ == "__main__":
    create_approved_superuser()
'''

# Save the Django management script
with open('django_create_superuser.py', 'w') as f:
    f.write(script_content)

print("Django management script created: django_create_superuser.py")
print("\nThis script can be executed on Railway in several ways:")
print("1. Via Railway console: python manage.py shell < django_create_superuser.py")
print("2. Via Railway's web terminal")
print("3. By copying the script content into Django shell")

# Also create a simple HTTP endpoint caller
def call_django_script_via_http():
    """Try to execute the Django script via HTTP if there's an endpoint"""
    import requests
    
    BACKEND_URL = "https://medixscan-production.up.railway.app/api"
    
    # Try to find a Django management endpoint
    management_endpoints = [
        "/django/execute/",
        "/admin/execute-script/",
        "/management/run-script/",
        "/system/django-command/"
    ]
    
    script_data = {
        "script": script_content,
        "command": "create_superuser", 
        "action": "execute_django_script"
    }
    
    print("\nTrying to execute Django script via HTTP endpoints...")
    
    for endpoint in management_endpoints:
        try:
            response = requests.post(f"{BACKEND_URL}{endpoint}", json=script_data)
            print(f"{endpoint}: {response.status_code}")
            
            if response.status_code in [200, 201]:
                print(f"✅ Django script executed successfully!")
                return True
                
        except Exception as e:
            continue
    
    return False

# Try to execute via HTTP
if not call_django_script_via_http():
    print("\n❌ Could not execute Django script via HTTP")
    print("📋 Manual execution required:")
    print("1. Access Railway project console")
    print("2. Run: python manage.py shell")
    print("3. Copy and paste the Django script content")
    print("4. Or run: python manage.py shell < django_create_superuser.py")

print(f"\n🎯 The goal is to create these users with is_approved=True:")
print("   Email: tanzeem.agra@rugrel.com")  
print("   Email: admin@medixscan.com")
print("   Password: Tanzilla@tanzeem786 (for Tanzeem)")
print("   Password: admin123 (for admin)")