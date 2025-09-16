#!/usr/bin/env python3
"""
Railway Direct Database Connection - Approve drnajeeb@gmail.com
Uses the connection details from Railway CLI variables
"""

import psycopg2
import sys

# Railway Database Configuration (from railway variables output)
DATABASE_CONFIG = {
    'host': 'tramway.proxy.rlwy.net',
    'port': 19262,
    'database': 'railway',
    'user': 'postgres', 
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def approve_user():
    """Approve drnajeeb@gmail.com using Railway database connection"""
    connection = None
    try:
        print("🔗 Connecting to Railway PostgreSQL database...")
        print(f"📡 Host: {DATABASE_CONFIG['host']}:{DATABASE_CONFIG['port']}")
        
        # Connect to Railway database
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("✅ Connected to Railway database successfully!")
        
        # Step 1: Check if user exists (using correct table name)
        print("\n📋 Step 1: Checking if user exists...")
        cursor.execute("SELECT id, email, is_active, created_at FROM auth_users WHERE email = %s;", 
                      ('drnajeeb@gmail.com',))
        user_result = cursor.fetchone()
        
        if not user_result:
            print("❌ User drnajeeb@gmail.com does not exist in database")
            return False
            
        user_id, email, is_active, date_joined = user_result
        print(f"✅ Found user:")
        print(f"   ID: {user_id}")
        print(f"   Email: {email}")
        print(f"   Active: {is_active}")
        print(f"   Created: {date_joined}")
        
        # Step 2: Activate the user if not already active
        if not is_active:
            print("\n🔓 Step 2: Activating user account...")
            cursor.execute("UPDATE auth_users SET is_active = true WHERE email = %s;", 
                          ('drnajeeb@gmail.com',))
            print("✅ User account activated!")
        else:
            print("\n✅ User account is already active")
        
        # Step 3: Check/create user profile (using correct table name)
        print("\n👤 Step 3: Checking user profile...")
        cursor.execute("SELECT * FROM auth_user_profiles WHERE user_id = %s;", (user_id,))
        profile_result = cursor.fetchone()
        
        if not profile_result:
            print("📝 Creating user profile...")
            cursor.execute("""
                INSERT INTO auth_user_profiles (user_id, role, department, specialization, is_approved, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW());
            """, (user_id, 'DOCTOR', 'Radiology', 'General Radiology', True))
            print("✅ User profile created!")
        else:
            print("📝 Updating existing user profile...")
            cursor.execute("""
                UPDATE auth_user_profiles 
                SET is_approved = true, role = 'DOCTOR', updated_at = NOW()
                WHERE user_id = %s;
            """, (user_id,))
            print("✅ User profile updated!")
        
        # Step 4: Commit all changes
        connection.commit()
        print("\n💾 Step 4: Changes committed to database!")
        
        # Step 5: Verify the changes (using correct table names)
        print("\n🔍 Step 5: Verifying approval...")
        cursor.execute("""
            SELECT u.id, u.email, u.is_active, p.role, p.is_approved, p.department
            FROM auth_users u 
            LEFT JOIN auth_user_profiles p ON u.id = p.user_id 
            WHERE u.email = %s;
        """, ('drnajeeb@gmail.com',))
        
        verification = cursor.fetchone()
        if verification:
            user_id, email, active, role, approved, department = verification
            print(f"📊 Final Status:")
            print(f"   Email: {email}")
            print(f"   Active: {active}")
            print(f"   Role: {role}")
            print(f"   Approved: {approved}")
            print(f"   Department: {department}")
            
            if active and approved:
                print("\n🎉 SUCCESS! drnajeeb@gmail.com has been fully approved!")
                print("✅ User can now login with: drnajeeb@gmail.com / Najeeb@123")
                return True
            else:
                print("\n❌ Something went wrong with the approval process")
                return False
        
        return False
        
    except psycopg2.OperationalError as e:
        if "password authentication failed" in str(e):
            print("❌ Database password authentication failed")
            print("🔧 Railway connection credentials may have changed")
        else:
            print(f"❌ Database connection error: {e}")
        return False
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
        
    finally:
        if connection:
            connection.close()
            print("🔒 Database connection closed")

def main():
    """Main function"""
    print("🏥 Railway Database User Approval")
    print("=" * 50)
    print("Goal: Approve drnajeeb@gmail.com for login access")
    print("=" * 50)
    
    try:
        success = approve_user()
        
        if success:
            print("\n" + "=" * 50)
            print("🎯 NEXT STEPS:")
            print("1. Clear browser cache (Ctrl+Shift+Delete)")
            print("2. Go to: https://www.rugrel.in/auth/sign-in") 
            print("3. Login with: drnajeeb@gmail.com / Najeeb@123")
            print("4. Should redirect to dashboard successfully!")
        else:
            print("\n❌ User approval failed")
            print("🔧 Manual intervention may be required")
            
    except KeyboardInterrupt:
        print("\n🛑 Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Script error: {e}")

if __name__ == "__main__":
    main()