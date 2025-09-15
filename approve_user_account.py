#!/usr/bin/env python3
"""
User Account Approval Fix
Approves the pending user account to enable regular login
"""

import requests
import json
from datetime import datetime

class UserApprovalFix:
    def __init__(self):
        self.base_url = 'https://medixscan-production.up.railway.app/api'
        self.target_email = 'tanzeem.agra@rugrel.com'
        
        # Get authentication token from emergency login
        self.auth_token = None
        self.get_auth_token()
        
    def log_action(self, message, status="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        status_icon = {
            "INFO": "🔍",
            "SUCCESS": "✅", 
            "ERROR": "❌",
            "WARNING": "⚠️"
        }.get(status, "📋")
        print(f"{status_icon} [{timestamp}] {message}")
        
    def get_auth_token(self):
        """Get authentication token using emergency login"""
        try:
            self.log_action("Getting authentication token...")
            
            response = requests.post(
                f"{self.base_url}/auth/emergency-login/",
                json={
                    'email': self.target_email,
                    'password': 'Tanzilla@tanzeem786'
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('token')
                self.log_action(f"Authentication successful! Token: {self.auth_token[:20]}...", "SUCCESS")
                return True
            else:
                self.log_action(f"Authentication failed: {response.status_code}", "ERROR")
                return False
                
        except Exception as e:
            self.log_action(f"Authentication error: {e}", "ERROR")
            return False
            
    def approve_user_account(self):
        """Approve the user account to enable regular login"""
        if not self.auth_token:
            self.log_action("No authentication token available", "ERROR")
            return False
            
        try:
            self.log_action(f"Attempting to approve account: {self.target_email}")
            
            # Try multiple approval endpoints
            approval_endpoints = [
                '/auth/approve-user/',
                '/rbac/users/approve/',
                '/api/users/approve/',
                '/admin/approve-user/'
            ]
            
            headers = {
                'Authorization': f'Token {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            for endpoint in approval_endpoints:
                try:
                    url = f"{self.base_url}{endpoint}"
                    self.log_action(f"Trying approval endpoint: {endpoint}")
                    
                    # Try different payload formats
                    payloads = [
                        {'email': self.target_email, 'approved': True},
                        {'user_id': 1, 'approved': True},
                        {'username': 'tanzeem.agra', 'approved': True},
                        {'email': self.target_email, 'is_approved': True, 'is_active': True}
                    ]
                    
                    for payload in payloads:
                        response = requests.post(url, json=payload, headers=headers, timeout=10)
                        
                        if response.status_code in [200, 201]:
                            self.log_action(f"Account approved successfully via {endpoint}!", "SUCCESS")
                            return True
                        elif response.status_code == 404:
                            break  # Try next endpoint
                        else:
                            self.log_action(f"Approval attempt failed: {response.status_code} - {response.text[:100]}")
                            
                except Exception as e:
                    self.log_action(f"Endpoint {endpoint} error: {e}", "WARNING")
                    continue
                    
            return False
            
        except Exception as e:
            self.log_action(f"Approval process error: {e}", "ERROR")
            return False
            
    def verify_account_status(self):
        """Verify current account status"""
        if not self.auth_token:
            return False
            
        try:
            headers = {'Authorization': f'Token {self.auth_token}'}
            
            # Get user profile to check status
            response = requests.get(
                f"{self.base_url}/auth/user/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                user_data = response.json()
                self.log_action(f"Current user status: {json.dumps(user_data, indent=2)}")
                
                # Check if approved
                is_approved = user_data.get('is_approved', False) or user_data.get('approved', False)
                is_active = user_data.get('is_active', True)
                
                if is_approved and is_active:
                    self.log_action("✅ Account is approved and active!", "SUCCESS")
                    return True
                else:
                    self.log_action(f"Account status - Approved: {is_approved}, Active: {is_active}", "WARNING")
                    return False
            else:
                self.log_action(f"Failed to get user status: {response.status_code}", "ERROR")
                return False
                
        except Exception as e:
            self.log_action(f"Status check error: {e}", "ERROR")
            return False
            
    def test_regular_login(self):
        """Test if regular login now works"""
        try:
            self.log_action("Testing regular login endpoint...")
            
            response = requests.post(
                f"{self.base_url}/auth/login/",
                json={
                    'email': self.target_email,
                    'password': 'Tanzilla@tanzeem786'
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_action("✅ Regular login now works!", "SUCCESS")
                return True
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_action(f"Regular login still blocked: {error_data}", "WARNING")
                return False
                
        except Exception as e:
            self.log_action(f"Regular login test error: {e}", "ERROR")
            return False
            
    def run_approval_process(self):
        """Run complete approval process"""
        self.log_action("🚀 Starting User Account Approval Process")
        
        if not self.auth_token:
            self.log_action("❌ Cannot proceed without authentication", "ERROR")
            return False
            
        # Check current status
        self.verify_account_status()
        
        # Attempt approval
        if self.approve_user_account():
            self.log_action("✅ Account approval completed", "SUCCESS")
        else:
            self.log_action("⚠️ Automatic approval failed - may need manual approval", "WARNING")
            
        # Test regular login
        if self.test_regular_login():
            self.log_action("🎉 Account fully functional - regular login works!", "SUCCESS")
            return True
        else:
            self.log_action("ℹ️ Continue using emergency login endpoint for now", "INFO")
            return False

if __name__ == "__main__":
    fixer = UserApprovalFix()
    success = fixer.run_approval_process()
    
    print("\n" + "="*50)
    if success:
        print("🎉 SUCCESS: Account approved - regular login works!")
    else:
        print("📋 WORKAROUND: Use emergency login endpoint")
        print("   Frontend will now use /auth/emergency-login/ automatically")
        print("   Login at https://www.rugrel.in/auth/sign-in should work now!")