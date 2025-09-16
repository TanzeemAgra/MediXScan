#!/usr/bin/env python3
"""
Railway Database Direct Approval Script
Alternative methods to approve drnajeeb@gmail.com
"""

import requests
import json
import subprocess
import os

def method_1_railway_cli():
    """Method 1: Using Railway CLI"""
    print("🚂 Method 1: Railway CLI Database Access")
    print("=" * 50)
    
    # Check if Railway CLI is installed
    try:
        result = subprocess.run(['railway', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Railway CLI is installed")
            print("\n📋 Steps to approve user via Railway CLI:")
            print("1. railway login")
            print("2. railway link (select your MediXScan project)")
            print("3. railway connect postgres")
            print("4. Run these SQL commands in the postgres shell:")
            print("\n   UPDATE auth_user SET is_active = true WHERE email = 'drnajeeb@gmail.com';")
            print("\n   INSERT INTO auth_userprofile (user_id, role, department, specialization, is_approved)")
            print("   VALUES ((SELECT id FROM auth_user WHERE email = 'drnajeeb@gmail.com'), 'DOCTOR', 'Radiology', 'General Radiology', true)")
            print("   ON CONFLICT (user_id) DO UPDATE SET is_approved = true, role = 'DOCTOR';")
            print("\n5. Type \\q to exit postgres shell")
            return True
        else:
            print("❌ Railway CLI not installed")
            return False
    except FileNotFoundError:
        print("❌ Railway CLI not found")
        return False

def method_2_railway_dashboard():
    """Method 2: Railway Dashboard Navigation"""
    print("\n🌐 Method 2: Railway Dashboard Database Access")
    print("=" * 50)
    
    print("📋 Alternative ways to find database access in Railway:")
    print("\n1. **Variables Tab Method:**")
    print("   - Go to railway.app")
    print("   - Select your MediXScan project")
    print("   - Click on PostgreSQL service")
    print("   - Look for 'Variables' or 'Environment' tab")
    print("   - Find DATABASE_URL or connection details")
    
    print("\n2. **Connect Tab Method:**")
    print("   - In PostgreSQL service")
    print("   - Look for 'Connect' or 'Database' tab")
    print("   - Should show connection options")
    
    print("\n3. **Settings Tab Method:**")
    print("   - In PostgreSQL service") 
    print("   - Go to 'Settings' tab")
    print("   - Look for 'Database Access' or 'External Access'")
    
    print("\n4. **Logs Tab Method:**")
    print("   - Sometimes shows connection strings in logs")

def method_3_api_based_approval():
    """Method 3: Try to find an API endpoint for user approval"""
    print("\n🔌 Method 3: API-Based User Approval")
    print("=" * 50)
    
    # Try to find admin users or approval endpoints
    api_base = "https://medixscan-production.up.railway.app"
    
    endpoints_to_try = [
        "/api/admin/users/",
        "/api/rbac/approve/", 
        "/api/auth/approve-user/",
        "/api/admin/approve/",
        "/api/users/approve/"
    ]
    
    print("🔍 Checking for user approval endpoints...")
    
    for endpoint in endpoints_to_try:
        try:
            response = requests.get(f"{api_base}{endpoint}", timeout=5)
            print(f"📡 {endpoint}: {response.status_code}")
            if response.status_code in [200, 401, 403]:  # Endpoint exists
                print(f"   ✅ Endpoint exists (needs authentication)")
        except:
            print(f"📡 {endpoint}: Not found")
    
    return False

def method_4_create_superuser_script():
    """Method 4: Create a script to make a superuser who can approve others"""
    print("\n👑 Method 4: Create Superuser for Approval")
    print("=" * 50)
    
    script_content = '''#!/usr/bin/env python3
"""
Django Management Command - Create Superuser
Run this if you have Django management access
"""

import os
import django
from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

User = get_user_model()

def create_superuser_and_approve():
    """Create superuser and approve drnajeeb"""
    try:
        # Create superuser if doesn't exist
        if not User.objects.filter(email='admin@medixscan.com').exists():
            superuser = User.objects.create_superuser(
                email='admin@medixscan.com',
                password='Admin@12345',
                first_name='Super',
                last_name='Admin'
            )
            print("✅ Superuser created: admin@medixscan.com / Admin@12345")
        
        # Approve drnajeeb user
        try:
            user = User.objects.get(email='drnajeeb@gmail.com')
            user.is_active = True
            user.save()
            
            # Create/update profile
            from accounts.models import UserProfile
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'role': 'DOCTOR',
                    'department': 'Radiology',
                    'specialization': 'General Radiology',
                    'is_approved': True
                }
            )
            if not created:
                profile.is_approved = True
                profile.role = 'DOCTOR'
                profile.save()
            
            print("✅ drnajeeb@gmail.com approved successfully!")
            
        except User.DoesNotExist:
            print("❌ drnajeeb@gmail.com user not found")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_superuser_and_approve()
'''
    
    with open('d:/radiology_v2/create_superuser_approve.py', 'w') as f:
        f.write(script_content)
    
    print("📝 Created Django management script: create_superuser_approve.py")
    print("\n📋 To use this script:")
    print("1. If you have access to the backend server/container")
    print("2. Run: python create_superuser_approve.py")
    print("3. This will create admin@medixscan.com / Admin@12345")
    print("4. And automatically approve drnajeeb@gmail.com")

def method_5_alternative_connection_strings():
    """Method 5: Show how to construct connection strings manually"""
    print("\n🔗 Method 5: Manual Database Connection")
    print("=" * 50)
    
    print("📋 If you can find these Railway environment variables:")
    print("   - PGHOST or DATABASE_HOST")
    print("   - PGPORT or DATABASE_PORT") 
    print("   - PGDATABASE or DATABASE_NAME")
    print("   - PGUSER or DATABASE_USER")
    print("   - PGPASSWORD or DATABASE_PASSWORD")
    
    print("\n🛠️  You can use any PostgreSQL client:")
    print("1. **pgAdmin** (GUI tool)")
    print("2. **DBeaver** (Universal DB tool)")
    print("3. **psql** (Command line)")
    print("4. **TablePlus** (Modern DB GUI)")
    
    print("\n🔌 Connection format:")
    print("   Host: autorack.proxy.rlwy.net")
    print("   Port: (from Railway variables)")
    print("   Database: railway") 
    print("   User: postgres")
    print("   Password: (from Railway variables)")

def main():
    """Show all methods to approve the user"""
    print("🏥 Railway Database Access Methods for User Approval")
    print("=" * 60)
    print("Goal: Approve drnajeeb@gmail.com in PostgreSQL database")
    print("=" * 60)
    
    # Try each method
    cli_available = method_1_railway_cli()
    method_2_railway_dashboard()
    method_3_api_based_approval()
    method_4_create_superuser_script()
    method_5_alternative_connection_strings()
    
    print("\n" + "=" * 60)
    print("🎯 RECOMMENDED APPROACH:")
    if cli_available:
        print("✅ Use Method 1: Railway CLI (most reliable)")
    else:
        print("✅ Use Method 2: Find database access in Railway dashboard")
        print("✅ Alternative: Method 5 with pgAdmin/DBeaver")
    
    print("\n📞 If all else fails:")
    print("   - Contact Railway support")
    print("   - Ask for database query execution help")
    print("   - Provide them the SQL commands to run")

if __name__ == "__main__":
    main()