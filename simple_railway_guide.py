#!/usr/bin/env python3
"""
Simple Railway Database Access Guide
Step-by-step instructions to approve drnajeeb@gmail.com
"""

print("Railway Database Access Guide")
print("=" * 40)
print("\nSince there's no Query tab, try these steps:")

print("\n1. RAILWAY DASHBOARD METHOD:")
print("   - Go to https://railway.app")
print("   - Click on your MediXScan project")  
print("   - Click on the PostgreSQL service/database")
print("   - Look for one of these tabs:")
print("     * 'Connect'")
print("     * 'Database'") 
print("     * 'Variables'")
print("     * 'Settings'")

print("\n2. LOOK FOR CONNECTION INFO:")
print("   In any of those tabs, find:")
print("   - Database URL")
print("   - Host/Port/Username/Password")
print("   - Connection string")

print("\n3. DATABASE TOOLS TO USE:")
print("   Download one of these free tools:")
print("   - pgAdmin: https://www.pgadmin.org/download/")
print("   - DBeaver: https://dbeaver.io/download/")
print("   - TablePlus: https://tableplus.com/")

print("\n4. SQL COMMANDS TO RUN:")
print("   Once connected, run these commands:")

sql_commands = '''
-- Check if user exists
SELECT id, email, is_active FROM auth_user WHERE email = 'drnajeeb@gmail.com';

-- Activate user
UPDATE auth_user SET is_active = true WHERE email = 'drnajeeb@gmail.com';

-- Create user profile  
INSERT INTO auth_userprofile (user_id, role, department, specialization, is_approved)
VALUES (
    (SELECT id FROM auth_user WHERE email = 'drnajeeb@gmail.com'),
    'DOCTOR',
    'Radiology', 
    'General Radiology',
    true
) ON CONFLICT (user_id) DO UPDATE SET is_approved = true, role = 'DOCTOR';

-- Verify fix
SELECT u.email, u.is_active, p.role, p.is_approved 
FROM auth_user u 
LEFT JOIN auth_userprofile p ON u.id = p.user_id 
WHERE u.email = 'drnajeeb@gmail.com';
'''

print(sql_commands)

print("\n5. ALTERNATIVE - RAILWAY CLI:")
print("   If you want to install Railway CLI:")
print("   - Windows: winget install Railway.CLI")
print("   - Or download from: https://railway.app/cli")

print("\n6. WHAT TO LOOK FOR IN RAILWAY:")
print("   The database connection details are usually in:")
print("   - Variables tab (DATABASE_URL)")
print("   - Connect tab (connection details)")
print("   - Settings > Environment Variables")

print("\nNeed help finding the database access in Railway?")
print("Tell me what tabs/options you see in your PostgreSQL service!")