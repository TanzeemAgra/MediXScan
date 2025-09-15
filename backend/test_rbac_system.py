"""
RBAC API Testing Script
Demonstrates the complete Role-Based Access Control system
"""

import requests
import json
from datetime import datetime

# API Base URL
BASE_URL = "http://localhost:8000/api"

class RBACTester:
    def __init__(self):
        self.tokens = {}
        self.users = {}
    
    def login_user(self, email, password, user_type):
        """Login and store token for a user"""
        login_data = {
            "email": email,
            "password": password
        }
        
        try:
            response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
            if response.status_code == 200:
                data = response.json()
                self.tokens[user_type] = data['token']
                self.users[user_type] = data['user']
                print(f"✅ {user_type} login successful: {email}")
                return True
            else:
                print(f"❌ {user_type} login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ {user_type} login error: {str(e)}")
            return False
    
    def get_headers(self, user_type):
        """Get authorization headers for a user"""
        token = self.tokens.get(user_type)
        if token:
            return {"Authorization": f"Token {token}", "Content-Type": "application/json"}
        return {"Content-Type": "application/json"}
    
    def test_endpoint(self, endpoint, method="GET", user_type=None, data=None, expected_status=200):
        """Test an API endpoint with specific user credentials"""
        headers = self.get_headers(user_type) if user_type else {"Content-Type": "application/json"}
        url = f"{BASE_URL}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            
            status_icon = "✅" if response.status_code == expected_status else "❌"
            user_label = f"({user_type})" if user_type else "(no auth)"
            
            print(f"{status_icon} {method} {endpoint} {user_label}: {response.status_code}")
            
            if response.status_code != expected_status:
                print(f"   Expected: {expected_status}, Got: {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
            
            return response
        except Exception as e:
            print(f"❌ Error testing {endpoint}: {str(e)}")
            return None
    
    def display_user_info(self, user_type):
        """Display user information and permissions"""
        user = self.users.get(user_type)
        if user:
            print(f"\n📋 {user_type.upper()} USER INFO:")
            print(f"   Name: {user.get('full_name', 'N/A')}")
            print(f"   Email: {user.get('email', 'N/A')}")
            print(f"   Roles: {', '.join(user.get('role_names', []))}")
            print(f"   Permissions: {len(user.get('all_permissions', []))} permissions")
            
            # Show first few permissions
            permissions = user.get('all_permissions', [])
            if permissions:
                print(f"   Sample Permissions:")
                for perm in permissions[:5]:
                    print(f"     - {perm.get('name', 'N/A')} ({perm.get('codename', 'N/A')})")
                if len(permissions) > 5:
                    print(f"     ... and {len(permissions) - 5} more")
    
    def run_comprehensive_test(self):
        """Run comprehensive RBAC testing"""
        print("🚀 RBAC System Testing Started")
        print("=" * 50)
        
        # Test 1: Login with different user types
        print("\n1. Testing User Authentication")
        print("-" * 30)
        
        # Login SuperUser
        superuser_login = self.login_user(
            "tanzeem.agra@rugrel.com", 
            "Tanzilla@tanzeem786", 
            "superuser"
        )
        
        # Login Doctor 1
        doctor1_login = self.login_user(
            "dr.smith@radiology.com", 
            "doctor123", 
            "doctor1"
        )
        
        # Login Doctor 2
        doctor2_login = self.login_user(
            "dr.johnson@radiology.com", 
            "doctor123", 
            "doctor2"
        )
        
        # Display user information
        if superuser_login:
            self.display_user_info("superuser")
        if doctor1_login:
            self.display_user_info("doctor1")
        if doctor2_login:
            self.display_user_info("doctor2")
        
        # Test 2: SuperUser Only Endpoints
        print("\n2. Testing SuperUser Only Endpoints")
        print("-" * 40)
        
        # Test user management (SuperUser should succeed, others should fail)
        self.test_endpoint("/auth/users/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/users/", "GET", "doctor1", expected_status=403)
        self.test_endpoint("/auth/users/", "GET", None, expected_status=401)
        
        # Test role management
        self.test_endpoint("/auth/roles/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/roles/", "GET", "doctor1", expected_status=403)
        
        # Test permission management
        self.test_endpoint("/auth/permissions/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/permissions/", "GET", "doctor1", expected_status=403)
        
        # Test 3: Doctor Creation (SuperUser Only)
        print("\n3. Testing Doctor Creation")
        print("-" * 30)
        
        new_doctor_data = {
            "username": "dr_test",
            "email": "dr.test@radiology.com",
            "password": "testpassword123",
            "password_confirm": "testpassword123",
            "full_name": "Dr. Test User",
            "department": "Radiology",
            "employee_id": "DOC003",
            "is_approved": True,
            "roles": ["DOCTOR"],
            "permissions": ["upload_scan", "view_report"]
        }
        
        self.test_endpoint("/auth/create-doctor/", "POST", "superuser", new_doctor_data, expected_status=201)
        self.test_endpoint("/auth/create-doctor/", "POST", "doctor1", new_doctor_data, expected_status=403)
        
        # Test 4: Role Assignment (SuperUser Only)
        print("\n4. Testing Role Assignment")
        print("-" * 30)
        
        # Get user ID for role assignment (would need to be dynamic in real scenario)
        role_assignment_data = {
            "user_id": "12345678-1234-1234-1234-123456789012",  # Mock UUID
            "role_name": "TECHNICIAN"
        }
        
        # This will fail with 404 (user not found) but should show proper permission checking
        self.test_endpoint("/auth/assign-role/", "POST", "superuser", role_assignment_data, expected_status=404)
        self.test_endpoint("/auth/assign-role/", "POST", "doctor1", role_assignment_data, expected_status=403)
        
        # Test 5: Doctor Specific Endpoints
        print("\n5. Testing Doctor Specific Endpoints")
        print("-" * 40)
        
        # Test scan upload (requires upload_scan permission)
        self.test_endpoint("/auth/upload-scan/", "POST", "doctor1", expected_status=200)
        self.test_endpoint("/auth/upload-scan/", "POST", "doctor2", expected_status=200)
        self.test_endpoint("/auth/upload-scan/", "POST", "superuser", expected_status=200)  # SuperUser has all permissions
        self.test_endpoint("/auth/upload-scan/", "POST", None, expected_status=401)
        
        # Test report viewing (requires view_report permission)
        self.test_endpoint("/auth/view-report/", "GET", "doctor1", expected_status=200)
        self.test_endpoint("/auth/view-report/", "GET", "doctor2", expected_status=200)
        self.test_endpoint("/auth/view-report/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/view-report/", "GET", None, expected_status=401)
        
        # Test 6: Dashboard Access
        print("\n6. Testing Dashboard Access")
        print("-" * 30)
        
        self.test_endpoint("/auth/dashboard/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/dashboard/", "GET", "doctor1", expected_status=200)
        self.test_endpoint("/auth/dashboard/", "GET", "doctor2", expected_status=200)
        self.test_endpoint("/auth/dashboard/", "GET", None, expected_status=401)
        
        # Test 7: Profile Management
        print("\n7. Testing Profile Management")
        print("-" * 30)
        
        self.test_endpoint("/auth/profile/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/profile/", "GET", "doctor1", expected_status=200)
        self.test_endpoint("/auth/profile/", "GET", None, expected_status=401)
        
        # Test 8: Audit Logs (SuperUser Only)
        print("\n8. Testing Audit Logs")
        print("-" * 25)
        
        self.test_endpoint("/auth/audit-logs/", "GET", "superuser", expected_status=200)
        self.test_endpoint("/auth/audit-logs/", "GET", "doctor1", expected_status=403)
        self.test_endpoint("/auth/audit-logs/", "GET", None, expected_status=401)
        
        print("\n🎉 RBAC Testing Completed!")
        print("=" * 50)
        
        # Summary
        print(f"\n📊 TESTING SUMMARY:")
        print(f"   SuperUser: {'✅ Active' if 'superuser' in self.tokens else '❌ Failed'}")
        print(f"   Doctor 1: {'✅ Active' if 'doctor1' in self.tokens else '❌ Failed'}")
        print(f"   Doctor 2: {'✅ Active' if 'doctor2' in self.tokens else '❌ Failed'}")
        print(f"   Total Users Authenticated: {len(self.tokens)}")

def main():
    """Main test function"""
    print("🏥 Radiology App RBAC System Demo")
    print("=================================")
    print("Testing comprehensive Role-Based Access Control")
    print(f"Server: {BASE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = RBACTester()
    tester.run_comprehensive_test()
    
    print("\n📚 API ENDPOINT REFERENCE:")
    print("=========================")
    print("SuperUser Only:")
    print("  POST /api/auth/create-doctor/      - Create doctor accounts")
    print("  POST /api/auth/assign-role/        - Assign roles to users")
    print("  POST /api/auth/assign-permission/  - Assign permissions to users")
    print("  GET  /api/auth/users/              - List all users")
    print("  GET  /api/auth/roles/              - List all roles")
    print("  GET  /api/auth/permissions/        - List all permissions")
    print("  GET  /api/auth/audit-logs/         - View audit logs")
    print("\nDoctor Permissions:")
    print("  POST /api/auth/upload-scan/        - Upload medical scans")
    print("  GET  /api/auth/view-report/        - View medical reports")
    print("\nAll Authenticated Users:")
    print("  GET  /api/auth/dashboard/          - View dashboard")
    print("  GET  /api/auth/profile/            - View/edit profile")
    print("  POST /api/auth/change-password/    - Change password")
    print("\nPublic Endpoints:")
    print("  POST /api/auth/register/           - User registration")
    print("  POST /api/auth/login/              - User login")
    print("  POST /api/auth/logout/             - User logout")

if __name__ == "__main__":
    main()
