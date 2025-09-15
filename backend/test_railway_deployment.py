#!/usr/bin/env python3
"""
Railway Deployment Test Script
=============================
Tests the Railway deployment after fixes
"""

import os
import sys
import django
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

def test_static_files_config():
    """Test static files configuration"""
    from django.conf import settings
    
    print("📁 Static Files Configuration:")
    print(f"   STATIC_URL: {settings.STATIC_URL}")
    print(f"   STATIC_ROOT: {settings.STATIC_ROOT}")
    
    # Check if staticfiles directory exists
    static_root = Path(settings.STATIC_ROOT)
    if static_root.exists():
        print(f"✅ Static root directory exists: {static_root}")
    else:
        print(f"❌ Static root directory missing: {static_root}")
        return False
    
    return True

def test_health_endpoints():
    """Test health check endpoints"""
    from django.urls import reverse
    from django.test import Client
    
    client = Client()
    
    endpoints_to_test = [
        ('ping', '/ping/'),
        ('status', '/status/'), 
        ('health', '/health/'),
    ]
    
    print("\n🏥 Health Check Endpoints:")
    all_good = True
    
    for name, path in endpoints_to_test:
        try:
            response = client.get(path)
            if response.status_code == 200:
                print(f"✅ {name} ({path}): OK")
            else:
                print(f"❌ {name} ({path}): Status {response.status_code}")
                all_good = False
        except Exception as e:
            print(f"❌ {name} ({path}): Error - {e}")
            all_good = False
    
    return all_good

def test_super_admin():
    """Test super admin user exists"""
    try:
        django.setup()
        from accounts.models import User
        
        admin_user = User.objects.get(email='tanzeem.agra@rugrel.com')
        print(f"\n👤 Super Admin User:")
        print(f"✅ Email: {admin_user.email}")
        print(f"✅ Active: {admin_user.is_active}")
        print(f"✅ Staff: {admin_user.is_staff}")
        print(f"✅ Superuser: {admin_user.is_superuser}")
        return True
        
    except Exception as e:
        print(f"\n❌ Super Admin Error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Railway Deployment Tests")
    print("=" * 40)
    
    tests = [
        ("Static Files Config", test_static_files_config),
        ("Health Endpoints", test_health_endpoints),
        ("Super Admin User", test_super_admin),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append(result)
        except Exception as e:
            print(f"❌ {test_name} failed with error: {e}")
            results.append(False)
    
    print("\n" + "=" * 40)
    if all(results):
        print("✅ All tests passed! Ready for Railway deployment")
        print("\n🚀 Deploy with: git push origin main")
        return True
    else:
        failed_count = len([r for r in results if not r])
        print(f"❌ {failed_count} test(s) failed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)