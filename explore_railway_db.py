#!/usr/bin/env python3
"""
Railway Database Explorer
Check what tables exist in the database
"""

import psycopg2

# Railway Database Configuration
DATABASE_CONFIG = {
    'host': 'tramway.proxy.rlwy.net',
    'port': 19262,
    'database': 'railway',
    'user': 'postgres', 
    'password': 'SqWAHjbZYonbRbThlhTkkmpfQlZCFSkL'
}

def explore_database():
    """Explore database structure to find user tables"""
    connection = None
    try:
        print("🔍 Exploring Railway PostgreSQL database...")
        
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        print("✅ Connected successfully!")
        
        # List all tables
        print("\n📋 Listing all tables:")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        if tables:
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("   No tables found in 'public' schema")
        
        # Check for Django-style tables
        print("\n🔍 Looking for Django user-related tables:")
        user_table_patterns = ['%user%', '%auth%', '%account%', '%profile%']
        
        for pattern in user_table_patterns:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name LIKE %s
                ORDER BY table_name;
            """, (pattern,))
            
            matches = cursor.fetchall()
            if matches:
                print(f"   Pattern '{pattern}':")
                for match in matches:
                    print(f"     - {match[0]}")
        
        # Check for any tables with 'email' column
        print("\n📧 Tables with 'email' column:")
        cursor.execute("""
            SELECT DISTINCT table_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND column_name = 'email'
            ORDER BY table_name;
        """)
        
        email_tables = cursor.fetchall()
        for table in email_tables:
            table_name = table[0]
            print(f"   - {table_name}")
            
            # Show sample data from email tables
            try:
                cursor.execute(f"SELECT email FROM {table_name} LIMIT 5;")
                emails = cursor.fetchall()
                for email in emails:
                    if 'drnajeeb@gmail.com' in email[0]:
                        print(f"     ✅ Found drnajeeb@gmail.com in {table_name}!")
                    else:
                        print(f"     📧 {email[0]}")
            except Exception as e:
                print(f"     ❌ Error reading {table_name}: {e}")
        
        # Check all schemas
        print("\n🗂️ Available schemas:")
        cursor.execute("SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;")
        schemas = cursor.fetchall()
        for schema in schemas:
            print(f"   - {schema[0]}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()
            print("\n🔒 Database connection closed")

if __name__ == "__main__":
    explore_database()