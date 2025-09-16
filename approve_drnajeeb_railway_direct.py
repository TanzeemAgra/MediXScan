#!/usr/bin/env python3
"""
Direct Railway Database User Approval
Directly approve drnajeeb@gmail.com in Railway PostgreSQL database
"""

import psycopg2
import os
from datetime import datetime

# Railway Database Configuration
DATABASE_CONFIG = {
    'host': 'autorack.proxy.rlwy.net',
    'port': 15560,
    'database': 'railway', 
    'user': 'postgres',
    'password': 'vZjFYxdaGLEyIDIXJjTKQIgqdjTAyFoX'
}

def approve_user_directly():
    """Directly approve drnajeeb@gmail.com in Railway database"""
    connection = None
    try:
        print("🔗 Connecting to Railway PostgreSQL database...")
        
        # Connect to Railway database
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("✅ Connected to Railway database successfully")
        
        # First, check if user exists
        cursor.execute("SELECT id, email, is_active, date_joined FROM auth_user WHERE email = %s;", 
                      ('drnajeeb@gmail.com',))
        user_result = cursor.fetchone()
        
        if not user_result:
            print("❌ User drnajeeb@gmail.com does not exist in database")
            return False
            
        user_id, email, is_active, date_joined = user_result
        print(f"📋 Found user: ID={user_id}, Email={email}, Active={is_active}, Joined={date_joined}")
        
        if is_active:
            print("✅ User is already active!")
            return True
            
        # Activate the user account
        print("🔓 Activating user account...")
        cursor.execute("UPDATE auth_user SET is_active = true WHERE email = %s;", 
                      ('drnajeeb@gmail.com',))
        
        # Check if user has a profile entry
        cursor.execute("SELECT * FROM auth_userprofile WHERE user_id = %s;", (user_id,))
        profile_result = cursor.fetchone()
        
        if not profile_result:
            print("👤 Creating user profile...")
            cursor.execute("""
                INSERT INTO auth_userprofile (user_id, role, department, specialization, is_approved)
                VALUES (%s, %s, %s, %s, %s);
            """, (user_id, 'DOCTOR', 'Radiology', 'General Radiology', True))
        else:
            print("👤 Updating existing profile to approved...")
            cursor.execute("""
                UPDATE auth_userprofile 
                SET is_approved = true, role = 'DOCTOR'
                WHERE user_id = %s;
            """, (user_id,))
        
        # Commit all changes
        connection.commit()
        print("💾 Changes committed to database")
        
        # Verify the changes
        cursor.execute("""
            SELECT u.email, u.is_active, p.role, p.is_approved 
            FROM auth_user u 
            LEFT JOIN auth_userprofile p ON u.id = p.user_id 
            WHERE u.email = %s;
        """, ('drnajeeb@gmail.com',))
        
        verification = cursor.fetchone()
        if verification:
            email, active, role, approved = verification
            print(f"✅ Verification - Email: {email}, Active: {active}, Role: {role}, Approved: {approved}")
            
            if active and approved:
                print("🎉 User drnajeeb@gmail.com has been successfully approved!")
                return True
        
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

def check_user_status():
    """Check current status of drnajeeb@gmail.com"""
    connection = None
    try:
        print("🔍 Checking user status in Railway database...")
        
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT u.id, u.email, u.is_active, u.date_joined, u.last_login,
                   p.role, p.department, p.specialization, p.is_approved
            FROM auth_user u 
            LEFT JOIN auth_userprofile p ON u.id = p.user_id 
            WHERE u.email = %s;
        """, ('drnajeeb@gmail.com',))
        
        result = cursor.fetchone()
        if result:
            user_id, email, is_active, date_joined, last_login, role, dept, spec, is_approved = result
            print(f"""
📊 User Status Report:
   ID: {user_id}
   Email: {email}
   Active: {is_active}
   Joined: {date_joined}
   Last Login: {last_login or 'Never'}
   Role: {role or 'No role assigned'}
   Department: {dept or 'Not set'}
   Specialization: {spec or 'Not set'}
   Profile Approved: {is_approved or False}
            """)
            return result
        else:
            print("❌ User not found in database")
            return None
            
    except Exception as e:
        print(f"❌ Error checking user status: {e}")
        return None
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    print("🏥 Railway Database User Approval Tool")
    print("=" * 50)
    
    # First check current status
    current_status = check_user_status()
    
    if current_status:
        user_id, email, is_active, date_joined, last_login, role, dept, spec, is_approved = current_status
        
        if is_active and is_approved:
            print("✅ User is already fully approved and active!")
        else:
            print("🔧 User needs approval. Proceeding...")
            if approve_user_directly():
                print("🎉 User approval completed successfully!")
            else:
                print("❌ Failed to approve user")
    else:
        print("❌ User does not exist in database")