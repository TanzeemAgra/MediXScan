#!/usr/bin/env python
"""
Script to set a known password for test users
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def set_test_passwords():
    """Set known passwords for test users"""
    try:
        # Update drnajeeb@gmail.com password
        user1 = User.objects.get(email='drnajeeb@gmail.com')
        user1.set_password('admin123')
        user1.save()
        print(f"Updated password for {user1.email}")
        
        # Update admin@radiology.com password
        user2 = User.objects.get(email='admin@radiology.com')
        user2.set_password('admin123')
        user2.save()
        print(f"Updated password for {user2.email}")
        
        print("Test passwords set successfully!")
        print("Both users now have password: admin123")
        
    except User.DoesNotExist as e:
        print(f"User not found: {e}")
    except Exception as e:
        print(f"Error setting passwords: {e}")

if __name__ == '__main__':
    set_test_passwords()
