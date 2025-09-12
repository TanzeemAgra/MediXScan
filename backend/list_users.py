#!/usr/bin/env python3
"""
Simple User List Script
"""

import os
import sys
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medixscan_project.settings')

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Setup Django
django.setup()

from accounts.models import User, Role

def main():
    print("=== DATABASE USERS ===")
    
    users = User.objects.all()
    print(f"Total users: {users.count()}")
    
    for user in users:
        roles = list(user.roles.values_list('name', flat=True))
        print(f"\nUser: {user.username}")
        print(f"Email: {user.email}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Roles: {roles}")
        print(f"Active: {user.is_active}")

if __name__ == '__main__':
    main()
