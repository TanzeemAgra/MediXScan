#!/usr/bin/env python3
"""
Fix the is_approved field for drnajeeb@gmail.com
"""

import psycopg2

DATABASE_CONFIG = {
    'host': 'tramway.proxy.rlwy.net',
    'port': 19262,
    'database': 'railway',
    'user': 'postgres', 
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def fix_approval():
    """Fix the is_approved field"""
    connection = None
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("🔧 FIXING: Setting is_approved = true for drnajeeb@gmail.com")
        
        # Update is_approved to true
        cursor.execute("""
            UPDATE auth_users 
            SET is_approved = true, updated_at = NOW()
            WHERE email = 'drnajeeb@gmail.com';
        """)
        
        # Commit the change
        connection.commit()
        print("✅ is_approved set to true!")
        
        # Verify the fix
        cursor.execute("""
            SELECT email, is_active, is_approved, is_staff, is_superuser
            FROM auth_users 
            WHERE email = 'drnajeeb@gmail.com';
        """)
        
        result = cursor.fetchone()
        if result:
            email, is_active, is_approved, is_staff, is_superuser = result
            print(f"\n📊 Verification:")
            print(f"   Email: {email}")
            print(f"   Active: {is_active}")
            print(f"   Approved: {is_approved}")
            print(f"   Staff: {is_staff}")
            print(f"   Superuser: {is_superuser}")
            
            if is_active and is_approved:
                print("\n🎉 SUCCESS! User is now fully approved!")
                return True
            else:
                print(f"\n❌ Still not fully approved")
                return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        if connection:
            connection.close()
            print("🔒 Database connection closed")

if __name__ == "__main__":
    print("🏥 Final User Approval Fix")
    print("=" * 40)
    
    if fix_approval():
        print("\n🎯 NEXT STEPS:")
        print("1. Clear browser cache")
        print("2. Try login: drnajeeb@gmail.com / Najeeb@123") 
        print("3. Should work now!")
    else:
        print("\n❌ Fix failed")