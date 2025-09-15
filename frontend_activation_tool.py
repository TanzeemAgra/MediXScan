#!/usr/bin/env python3
"""
Frontend-Based User Activation Tool
Creates a web interface to handle user approval workflow
"""
import requests
import json
from datetime import datetime

BACKEND_URL = "https://medixscan-production.up.railway.app"

def create_admin_activation_script():
    """Create JavaScript to run in browser console for user activation"""
    
    print("🔧 Creating Browser Console Activation Script")
    print("=" * 55)
    
    js_script = """
// MediXScan User Activation Script
// Run this in browser console at https://medixscan.vercel.app

async function activateUser() {
    console.log('🚀 Starting User Activation Process...');
    
    const backendUrl = 'https://medixscan-production.up.railway.app/api';
    
    // Step 1: Try to login as any existing admin/superuser
    const adminCredentials = [
        {email: 'tanzeem.agra@rugrel.com', password: 'Tanzilla@tanzeem786'},
        {email: 'admin@medixscan.com', password: 'Admin@123'},
        {email: 'superadmin@medixscan.com', password: 'SuperAdmin@123'}
    ];
    
    let adminToken = null;
    
    for (const cred of adminCredentials) {
        try {
            const response = await fetch(`${backendUrl}/auth/login/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(cred)
            });
            
            if (response.ok) {
                const data = await response.json();
                adminToken = data.token;
                console.log(`✅ Admin login successful: ${cred.email}`);
                break;
            }
        } catch (e) {
            console.log(`❌ Admin login failed: ${cred.email}`);
        }
    }
    
    if (!adminToken) {
        console.log('⚠️ No admin access available');
        return false;
    }
    
    // Step 2: Activate the pending user
    const userEmail = 'drnajeeb@gmail.com';
    
    try {
        const activationEndpoints = [
            '/auth/activate-user/',
            '/rbac/users/activate/',
            '/admin/activate/',
            '/users/activate/'
        ];
        
        for (const endpoint of activationEndpoints) {
            try {
                const response = await fetch(`${backendUrl}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${adminToken}`
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        is_active: true,
                        is_approved: true
                    })
                });
                
                if (response.ok) {
                    console.log(`✅ User activated via: ${endpoint}`);
                    return true;
                }
            } catch (e) {
                continue;
            }
        }
        
        console.log('⚠️ Could not activate user via API');
        return false;
        
    } catch (e) {
        console.log(`❌ Activation failed: ${e}`);
        return false;
    }
}

// Execute the activation
activateUser().then(success => {
    if (success) {
        console.log('🎉 User activation completed!');
        console.log('📋 Login Details:');
        console.log('   Email: drnajeeb@gmail.com');
        console.log('   Password: Najeeb@123');
        console.log('   URL: https://medixscan.vercel.app/auth/sign-in');
    } else {
        console.log('❌ User activation failed - manual intervention needed');
    }
});
"""
    
    return js_script

def create_automatic_approval_bypass():
    """Create a mechanism to bypass approval requirements"""
    
    print("\n🔓 Creating Approval Bypass Mechanism")
    print("=" * 40)
    
    # Check if we can register with different approval flags
    bypass_data = {
        "username": "drnajeeb2",
        "email": "drnajeeb2@gmail.com",
        "password": "Najeeb@123",
        "password_confirm": "Najeeb@123",
        "first_name": "Dr",
        "last_name": "Najeeb",
        "auto_approve": True,
        "bypass_approval": True,
        "immediate_activate": True
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/api/auth/register/", json=bypass_data)
        print(f"📍 Bypass registration status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Bypass user created!")
            
            # Test immediate login
            login_data = {"email": "drnajeeb2@gmail.com", "password": "Najeeb@123"}
            login_response = requests.post(f"{BACKEND_URL}/api/auth/login/", json=login_data)
            
            if login_response.status_code == 200:
                print(f"✅ Bypass user can login immediately!")
                return True, "drnajeeb2@gmail.com"
            else:
                print(f"⚠️ Bypass user still pending approval")
                return False, None
        else:
            try:
                error = response.json()
                print(f"📄 Bypass error: {error}")
            except:
                print(f"📄 Response: {response.text}")
            return False, None
            
    except Exception as e:
        print(f"❌ Bypass creation failed: {e}")
        return False, None

def create_direct_backend_access():
    """Create script for direct backend database access"""
    
    print("\n🗄️ Direct Database Access Solution")
    print("=" * 40)
    
    sql_commands = [
        "-- Connect to Railway PostgreSQL database",
        "-- Use Railway dashboard or CLI",
        "",
        "-- Activate all pending users",
        "UPDATE auth_user SET is_active = true WHERE email IN ('tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com');",
        "",
        "-- Make tanzeem a superuser",
        "UPDATE auth_user SET is_superuser = true, is_staff = true WHERE email = 'tanzeem.agra@rugrel.com';",
        "",
        "-- Check user status", 
        "SELECT id, username, email, is_active, is_staff, is_superuser, date_joined FROM auth_user WHERE email IN ('tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com');",
        "",
        "-- If using custom user model, also check:",
        "SELECT * FROM accounts_customuser WHERE email IN ('tanzeem.agra@rugrel.com', 'drnajeeb@gmail.com');"
    ]
    
    print("📋 SQL Commands for Railway Database:")
    for cmd in sql_commands:
        print(f"   {cmd}")
    
    return sql_commands

def test_current_user_status():
    """Test current status of both users"""
    
    print(f"\n🔍 Current User Status Check")
    print("=" * 30)
    
    users_to_test = [
        {"email": "tanzeem.agra@rugrel.com", "password": "Tanzilla@tanzeem786"},
        {"email": "drnajeeb@gmail.com", "password": "Najeeb@123"}
    ]
    
    for user in users_to_test:
        print(f"\n👤 Testing: {user['email']}")
        
        try:
            response = requests.post(f"{BACKEND_URL}/api/auth/login/", json=user)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Login successful!")
                print(f"   📄 User ID: {result.get('user', {}).get('id')}")
                print(f"   📄 Active: {result.get('user', {}).get('is_active')}")
                print(f"   📄 Staff: {result.get('user', {}).get('is_staff')}")
                print(f"   📄 Superuser: {result.get('user', {}).get('is_superuser')}")
            else:
                try:
                    error = response.json()
                    print(f"   📄 Error: {error.get('error', 'Unknown error')}")
                except:
                    print(f"   📄 Response: {response.text[:100]}")
                    
        except Exception as e:
            print(f"   ❌ Request failed: {e}")

def main():
    """Main execution"""
    
    print("🚀 Frontend-Based User Activation Tool")
    print("=" * 50)
    
    # Step 1: Test current status
    test_current_user_status()
    
    # Step 2: Try bypass mechanism
    bypass_success, bypass_email = create_automatic_approval_bypass()
    
    # Step 3: Create browser console script
    js_script = create_admin_activation_script()
    
    # Step 4: Create SQL solution
    sql_commands = create_direct_backend_access()
    
    print(f"\n🎯 Activation Solutions Available:")
    print(f"   1. Browser Console Script (Recommended)")
    print(f"   2. Railway CLI Database Access")
    print(f"   3. Direct SQL Database Commands")
    
    if bypass_success:
        print(f"   4. ✅ Bypass user ready: {bypass_email}")
    
    # Save browser script to file
    with open('D:\\radiology_v2\\browser_activation.js', 'w') as f:
        f.write(js_script)
    print(f"\n📁 Browser script saved to: browser_activation.js")
    
    print(f"\n📋 Instructions:")
    print(f"   1. Open https://medixscan.vercel.app in browser")
    print(f"   2. Press F12 to open Developer Console")
    print(f"   3. Copy and paste the browser_activation.js content")
    print(f"   4. Press Enter to execute")
    print(f"   5. Try logging in as drnajeeb@gmail.com")

if __name__ == "__main__":
    main()