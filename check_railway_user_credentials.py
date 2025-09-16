#!/usr/bin/env python3
"""
Railway PostgreSQL User Verification Script
Checks user credentials and role permissions for drnajeeb@gmail.com and other users
"""

import psycopg2
import sys
from datetime import datetime

# Railway PostgreSQL Connection Parameters
DB_CONFIG = {
    'host': 'postgres.railway.internal',
    'port': 5432,
    'database': 'railway',
    'user': 'postgres',
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def connect_to_database():
    """Connect to Railway PostgreSQL database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def check_user_credentials():
    """Check user credentials and permissions"""
    conn = connect_to_database()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        print("🔍 Checking user credentials in Railway PostgreSQL...")
        print("=" * 60)
        
        # Check if drnajeeb@gmail.com exists
        print("1. Checking drnajeeb@gmail.com user...")
        cursor.execute("""
            SELECT id, email, first_name, last_name, is_active, is_staff, is_superuser, 
                   date_joined, last_login
            FROM auth_user 
            WHERE email = %s
        """, ('drnajeeb@gmail.com',))
        
        user = cursor.fetchone()
        if user:
            print(f"✅ User found:")
            print(f"   ID: {user[0]}")
            print(f"   Email: {user[1]}")
            print(f"   Name: {user[2]} {user[3]}")
            print(f"   Active: {user[4]}")
            print(f"   Staff: {user[5]}")
            print(f"   Superuser: {user[6]}")
            print(f"   Joined: {user[7]}")
            print(f"   Last Login: {user[8]}")
            
            # Check user groups/roles
            print(f"\n   Checking user groups/roles...")
            cursor.execute("""
                SELECT g.name 
                FROM auth_group g
                JOIN auth_user_groups ug ON g.id = ug.group_id
                WHERE ug.user_id = %s
            """, (user[0],))
            
            groups = cursor.fetchall()
            if groups:
                print(f"   Groups: {[g[0] for g in groups]}")
            else:
                print(f"   Groups: None assigned")
                
        else:
            print(f"❌ User drnajeeb@gmail.com NOT found in database")
            
        # List all users for reference
        print(f"\n2. All users in database:")
        cursor.execute("""
            SELECT email, first_name, last_name, is_active, is_staff, is_superuser 
            FROM auth_user 
            ORDER BY date_joined DESC
        """)
        
        users = cursor.fetchall()
        for i, user in enumerate(users, 1):
            status = []
            if user[3]: status.append("Active")
            if user[4]: status.append("Staff") 
            if user[5]: status.append("Superuser")
            status_str = ", ".join(status) if status else "Regular User"
            
            print(f"   {i}. {user[0]} ({user[1]} {user[2]}) - {status_str}")
            
        # Check available groups
        print(f"\n3. Available groups/roles:")
        cursor.execute("SELECT name, id FROM auth_group ORDER BY name")
        groups = cursor.fetchall()
        if groups:
            for group in groups:
                print(f"   - {group[0]} (ID: {group[1]})")
        else:
            print(f"   No groups defined")
            
        return True
        
    except Exception as e:
        print(f"❌ Error checking user credentials: {e}")
        return False
    finally:
        conn.close()

def create_user_if_not_exists():
    """Create drnajeeb@gmail.com user if it doesn't exist"""
    conn = connect_to_database()
    if not conn:
        return False
        
    try:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id FROM auth_user WHERE email = %s", ('drnajeeb@gmail.com',))
        if cursor.fetchone():
            print("✅ User drnajeeb@gmail.com already exists")
            return True
            
        print("📝 Creating user drnajeeb@gmail.com...")
        
        # Create user with hashed password
        from django.contrib.auth.hashers import make_password
        import os
        import django
        
        # Set Django settings
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
        sys.path.append('/app/backend')
        django.setup()
        
        hashed_password = make_password('Najeeb@123')
        
        cursor.execute("""
            INSERT INTO auth_user (
                email, username, first_name, last_name, password,
                is_active, is_staff, is_superuser, date_joined
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            'drnajeeb@gmail.com',
            'drnajeeb',
            'Dr',
            'Najeeb',
            hashed_password,
            True,  # is_active
            False, # is_staff
            False, # is_superuser
            datetime.now()
        ))
        
        conn.commit()
        print("✅ User drnajeeb@gmail.com created successfully")
        return True
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🏥 Railway PostgreSQL User Credential Checker")
    print("=" * 60)
    
    if check_user_credentials():
        print("\n✅ User credential check completed")
    else:
        print("\n❌ User credential check failed")
        
    print(f"\n🔧 Next steps:")
    print(f"1. If user doesn't exist, create them with proper roles")
    print(f"2. Implement soft-coded role-based access control")
    print(f"3. Test login with drnajeeb@gmail.com / Najeeb@123")