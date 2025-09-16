#!/usr/bin/env python3
"""
Check auth_user_profiles table structure
"""

import psycopg2

DATABASE_CONFIG = {
    'host': 'tramway.proxy.rlwy.net',
    'port': 19262,
    'database': 'railway',
    'user': 'postgres', 
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def check_profile_table():
    """Check profile table structure"""
    connection = None
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("📊 Checking auth_user_profiles table structure...")
        
        # Get column information
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'auth_user_profiles'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print("📋 Columns in auth_user_profiles:")
        for col in columns:
            print(f"   - {col[0]} ({col[1]}) {'NULL' if col[2] == 'YES' else 'NOT NULL'}")
        
        # Check existing data
        print("\n📊 Sample data from auth_user_profiles:")
        cursor.execute("SELECT * FROM auth_user_profiles LIMIT 3;")
        rows = cursor.fetchall()
        
        if rows:
            for row in rows:
                print(f"   {row}")
        else:
            print("   (no data)")
        
        # Check if drnajeeb has a profile
        print(f"\n🔍 Checking profile for user ID 5 (drnajeeb@gmail.com):")
        cursor.execute("SELECT * FROM auth_user_profiles WHERE user_id = 5;")
        profile = cursor.fetchone()
        
        if profile:
            print(f"   ✅ Profile exists: {profile}")
        else:
            print("   ❌ No profile found")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    check_profile_table()