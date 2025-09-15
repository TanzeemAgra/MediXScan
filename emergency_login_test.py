#!/usr/bin/env python3
"""
Emergency Login Testing and Diagnostic Tool
Tests login functionality with provided credentials using soft coding techniques
"""

import requests
import json
import sys
from datetime import datetime

class EmergencyLoginTester:
    def __init__(self):
        self.test_credentials = {
            'username': 'tanzeem.agra@rugrel.com',
            'password': 'Tanzilla@tanzeem786',
            'email': 'tanzeem.agra@rugrel.com'
        }
        
        # Soft-coded API endpoints (multiple fallbacks)
        self.api_endpoints = [
            'https://medixscan-production.up.railway.app/api',
            'https://api.rugrel.in/api',
        ]
        
        # Soft-coded authentication endpoints
        self.auth_paths = [
            '/auth/login/',
            '/auth/simple-login/',
            '/auth/emergency-login/',
            '/api/auth/login/',
            '/accounts/login/',
        ]
        
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'https://www.rugrel.in',
            'Referer': 'https://www.rugrel.in/auth/sign-in',
            'User-Agent': 'MediXScan-Emergency-Tester/1.0'
        }
        
    def log_test(self, message, status="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        status_icon = {
            "INFO": "🔍",
            "SUCCESS": "✅", 
            "ERROR": "❌",
            "WARNING": "⚠️"
        }.get(status, "📋")
        
        print(f"{status_icon} [{timestamp}] {message}")
        
    def test_api_connectivity(self, base_url):
        """Test basic API connectivity"""
        try:
            self.log_test(f"Testing connectivity to: {base_url}")
            
            # Test health endpoints
            health_endpoints = ['/health/', '/api/health/', '/']
            
            for endpoint in health_endpoints:
                try:
                    url = f"{base_url}{endpoint}"
                    response = requests.get(url, timeout=10, headers=self.headers)
                    self.log_test(f"Health check {endpoint}: {response.status_code}", "SUCCESS" if response.status_code < 400 else "WARNING")
                    
                    if response.status_code == 200:
                        return True
                        
                except Exception as e:
                    self.log_test(f"Health check {endpoint} failed: {e}", "WARNING")
                    continue
                    
            return False
            
        except Exception as e:
            self.log_test(f"Connectivity test failed: {e}", "ERROR")
            return False
            
    def test_cors_headers(self, base_url):
        """Test CORS configuration"""
        try:
            self.log_test(f"Testing CORS headers for: {base_url}")
            
            # Pre-flight OPTIONS request
            response = requests.options(
                f"{base_url}/auth/login/",
                headers={
                    'Origin': 'https://www.rugrel.in',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type'
                },
                timeout=10
            )
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
                'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
            }
            
            self.log_test(f"CORS Headers: {json.dumps(cors_headers, indent=2)}")
            
            if cors_headers['Access-Control-Allow-Origin'] in ['*', 'https://www.rugrel.in']:
                self.log_test("CORS configuration looks correct", "SUCCESS")
                return True
            else:
                self.log_test("CORS configuration may be blocking requests", "WARNING")
                return False
                
        except Exception as e:
            self.log_test(f"CORS test failed: {e}", "ERROR")
            return False
            
    def attempt_login(self, base_url, auth_path):
        """Attempt login with various credential formats"""
        
        credential_variations = [
            # Standard format
            {
                'email': self.test_credentials['email'],
                'password': self.test_credentials['password']
            },
            # Username format
            {
                'username': self.test_credentials['username'], 
                'password': self.test_credentials['password']
            },
            # Login ID format
            {
                'loginId': self.test_credentials['email'],
                'password': self.test_credentials['password']
            },
            # Django format
            {
                'username': self.test_credentials['email'],
                'password': self.test_credentials['password']
            }
        ]
        
        for i, credentials in enumerate(credential_variations):
            try:
                url = f"{base_url}{auth_path}"
                self.log_test(f"Attempting login #{i+1} at: {url}")
                self.log_test(f"Credentials format: {list(credentials.keys())}")
                
                response = requests.post(
                    url,
                    json=credentials,
                    headers=self.headers,
                    timeout=15
                )
                
                self.log_test(f"Response Status: {response.status_code}")
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if 'token' in data or 'access' in data or 'success' in data:
                            self.log_test(f"LOGIN SUCCESS! Response: {json.dumps(data, indent=2)}", "SUCCESS")
                            return True, data
                        else:
                            self.log_test(f"Login response (no token): {json.dumps(data, indent=2)}", "WARNING")
                    except:
                        self.log_test(f"Login success but invalid JSON: {response.text[:200]}", "WARNING")
                        
                elif response.status_code == 400:
                    try:
                        error_data = response.json()
                        self.log_test(f"Login validation error: {json.dumps(error_data, indent=2)}", "WARNING")
                    except:
                        self.log_test(f"Login error: {response.text[:200]}", "WARNING")
                        
                elif response.status_code == 401:
                    self.log_test("Invalid credentials or authentication failed", "ERROR")
                    
                elif response.status_code == 403:
                    self.log_test("Access forbidden - user may not exist or be inactive", "ERROR")
                    
                elif response.status_code >= 500:
                    self.log_test(f"Server error: {response.status_code}", "ERROR")
                    
                else:
                    self.log_test(f"Unexpected response: {response.status_code} - {response.text[:200]}", "WARNING")
                    
            except requests.exceptions.ConnectTimeout:
                self.log_test(f"Connection timeout for {url}", "ERROR")
            except requests.exceptions.ConnectionError as e:
                self.log_test(f"Connection error for {url}: {e}", "ERROR")
            except Exception as e:
                self.log_test(f"Login attempt failed: {e}", "ERROR")
                
        return False, None
        
    def run_comprehensive_test(self):
        """Run comprehensive login testing"""
        self.log_test("🚀 Starting Emergency Login Testing", "INFO")
        self.log_test(f"Testing credentials for: {self.test_credentials['email']}")
        
        successful_logins = []
        
        for base_url in self.api_endpoints:
            self.log_test(f"\n🔍 Testing API endpoint: {base_url}")
            
            # Test connectivity
            if not self.test_api_connectivity(base_url):
                self.log_test(f"Skipping {base_url} - connectivity failed", "WARNING")
                continue
                
            # Test CORS
            self.test_cors_headers(base_url)
            
            # Test authentication endpoints
            for auth_path in self.auth_paths:
                self.log_test(f"\n🔑 Testing auth endpoint: {auth_path}")
                success, data = self.attempt_login(base_url, auth_path)
                
                if success:
                    successful_logins.append({
                        'base_url': base_url,
                        'auth_path': auth_path,
                        'response_data': data
                    })
                    
        # Summary
        self.log_test("\n📋 TEST SUMMARY")
        if successful_logins:
            self.log_test(f"✅ Found {len(successful_logins)} working login endpoints:", "SUCCESS")
            for login in successful_logins:
                self.log_test(f"   • {login['base_url']}{login['auth_path']}", "SUCCESS")
        else:
            self.log_test("❌ No successful logins found", "ERROR")
            self.log_test("Possible issues:", "ERROR")
            self.log_test("   • User does not exist in database", "ERROR")  
            self.log_test("   • Password is incorrect", "ERROR")
            self.log_test("   • User account is inactive", "ERROR")
            self.log_test("   • CORS blocking all requests", "ERROR")
            self.log_test("   • API endpoints are down", "ERROR")
            
        return successful_logins

if __name__ == "__main__":
    tester = EmergencyLoginTester()
    results = tester.run_comprehensive_test()
    
    if not results:
        print("\n🛠️  EMERGENCY ACTIONS NEEDED:")
        print("1. Check if user exists in Railway database")
        print("2. Verify Railway CORS_ALLOW_ALL_ORIGINS=True is set")
        print("3. Test API endpoints manually")
        print("4. Check Railway deployment logs")
        sys.exit(1)
    else:
        print(f"\n🎉 Login testing completed - {len(results)} working endpoints found!")
        sys.exit(0)