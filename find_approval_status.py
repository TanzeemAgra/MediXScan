#!/usr/bin/env python3
"""
Find all approval-related data for drnajeeb@gmail.com
"""

import psycopg2

DATABASE_CONFIG = {
    'host': 'tramway.proxy.rlwy.net',
    'port': 19262,
    'database': 'railway',
    'user': 'postgres', 
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def find_approval_data():
    """Find all approval-related data"""
    connection = None
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("🔍 Comprehensive search for drnajeeb@gmail.com approval status...")
        
        # Check auth_users details
        print("\n1️⃣ auth_users table:")
        cursor.execute("SELECT * FROM auth_users WHERE email = 'drnajeeb@gmail.com';")
        user_data = cursor.fetchone()
        if user_data:
            print(f"   ✅ User data: {user_data}")
        
        # Check registration_notifications
        print("\n2️⃣ registration_notifications table:")
        cursor.execute("SELECT * FROM registration_notifications WHERE email = 'drnajeeb@gmail.com';")
        notifications = cursor.fetchall()
        if notifications:
            for notif in notifications:
                print(f"   📧 Notification: {notif}")
        else:
            print("   📧 No notifications found")
        
        # Check rbac_roles for user
        print("\n3️⃣ role_assignments table:")
        cursor.execute("SELECT * FROM role_assignments WHERE user_id = 5;")
        roles = cursor.fetchall()
        if roles:
            for role in roles:
                print(f"   👤 Role assignment: {role}")
        else:
            print("   👤 No role assignments found")
        
        # Check auth_user_roles
        print("\n4️⃣ auth_user_roles table:")
        cursor.execute("SELECT * FROM auth_user_roles WHERE user_id = 5;")
        user_roles = cursor.fetchall()
        if user_roles:
            for ur in user_roles:
                print(f"   🎭 User role: {ur}")
        else:
            print("   🎭 No user roles found")
        
        # Check all columns in auth_users for approval-related fields
        print("\n5️⃣ All auth_users columns for user:")
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'auth_users' 
            ORDER BY ordinal_position;
        """)
        columns = cursor.fetchall()
        print("   📋 Available columns:")
        for col in columns:
            print(f"      - {col[0]} ({col[1]})")
        
        # Get all user data with column names
        print("\n6️⃣ Complete user record:")
        cursor.execute("SELECT * FROM auth_users WHERE email = 'drnajeeb@gmail.com';")
        user_record = cursor.fetchone()
        column_names = [desc[0] for desc in cursor.description]
        
        if user_record:
            for i, value in enumerate(user_record):
                print(f"   {column_names[i]}: {value}")
        
        # Check for any pending status fields
        print("\n7️⃣ Looking for approval/status fields...")
        approval_fields = ['is_approved', 'status', 'approved', 'pending', 'verified', 'active']
        
        for field in approval_fields:
            try:
                cursor.execute(f"SELECT {field} FROM auth_users WHERE email = 'drnajeeb@gmail.com';")
                value = cursor.fetchone()
                if value:
                    print(f"   ✅ {field}: {value[0]}")
            except:
                print(f"   ❌ {field}: field not found")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    find_approval_data()