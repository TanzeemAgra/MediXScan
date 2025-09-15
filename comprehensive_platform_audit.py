#!/usr/bin/env python3
"""
Comprehensive Platform Audit and Fix Tool
Tests all platforms: Local, GitHub, Vercel, Railway
"""

import requests
import json
import subprocess
import os
from datetime import datetime
import time

class PlatformAuditor:
    def __init__(self):
        self.base_path = r"D:\radiology_v2"
        self.frontend_path = r"D:\radiology_v2\frontend"
        self.results = {
            'local': {},
            'github': {},
            'vercel': {},
            'railway': {},
            'recommendations': []
        }
        
    def log_audit(self, message, status="INFO", platform="GENERAL"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        status_icon = {
            "INFO": "🔍",
            "SUCCESS": "✅", 
            "ERROR": "❌",
            "WARNING": "⚠️",
            "FIX": "🔧"
        }.get(status, "📋")
        
        print(f"{status_icon} [{timestamp}] [{platform}] {message}")
        
    def audit_local_environment(self):
        """Audit local development environment"""
        self.log_audit("Starting Local Environment Audit", "INFO", "LOCAL")
        
        try:
            # Check if frontend directory exists and has correct structure
            if os.path.exists(self.frontend_path):
                self.log_audit("Frontend directory found", "SUCCESS", "LOCAL")
                
                # Check package.json
                package_json_path = os.path.join(self.frontend_path, "package.json")
                if os.path.exists(package_json_path):
                    with open(package_json_path, 'r') as f:
                        package_data = json.load(f)
                        self.log_audit(f"Package.json found - Project: {package_data.get('name')}", "SUCCESS", "LOCAL")
                        self.results['local']['package_name'] = package_data.get('name')
                
                # Check environment files
                env_files = ['.env.local', '.env.production', '.env']
                for env_file in env_files:
                    env_path = os.path.join(self.frontend_path, env_file)
                    if os.path.exists(env_path):
                        self.log_audit(f"Environment file found: {env_file}", "SUCCESS", "LOCAL")
                        
                        with open(env_path, 'r') as f:
                            env_content = f.read()
                            if 'VITE_API_BASE_URL' in env_content:
                                lines = env_content.split('\n')
                                for line in lines:
                                    if line.startswith('VITE_API_BASE_URL'):
                                        api_url = line.split('=')[1] if '=' in line else 'NOT_SET'
                                        self.log_audit(f"API URL in {env_file}: {api_url}", "INFO", "LOCAL")
                                        self.results['local'][f'{env_file}_api_url'] = api_url
                    else:
                        self.log_audit(f"Environment file missing: {env_file}", "WARNING", "LOCAL")
                
                # Check build output
                dist_path = os.path.join(self.frontend_path, "dist")
                if os.path.exists(dist_path):
                    self.log_audit("Build output (dist) directory exists", "SUCCESS", "LOCAL")
                    self.results['local']['build_exists'] = True
                else:
                    self.log_audit("No build output found", "WARNING", "LOCAL")
                    self.results['local']['build_exists'] = False
                    
            else:
                self.log_audit("Frontend directory not found!", "ERROR", "LOCAL")
                self.results['local']['frontend_exists'] = False
                
        except Exception as e:
            self.log_audit(f"Local audit failed: {e}", "ERROR", "LOCAL")
            
    def audit_github_repository(self):
        """Audit GitHub repository status"""
        self.log_audit("Starting GitHub Repository Audit", "INFO", "GITHUB")
        
        try:
            # Check git status
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True, cwd=self.base_path)
            
            if result.returncode == 0:
                if result.stdout.strip():
                    self.log_audit("Uncommitted changes found", "WARNING", "GITHUB")
                    self.results['github']['uncommitted_changes'] = True
                else:
                    self.log_audit("Working tree clean", "SUCCESS", "GITHUB")
                    self.results['github']['uncommitted_changes'] = False
            
            # Check last commit
            result = subprocess.run(['git', 'log', '--oneline', '-1'], 
                                  capture_output=True, text=True, cwd=self.base_path)
            
            if result.returncode == 0:
                last_commit = result.stdout.strip()
                self.log_audit(f"Last commit: {last_commit}", "INFO", "GITHUB")
                self.results['github']['last_commit'] = last_commit
                
            # Check if origin is set correctly
            result = subprocess.run(['git', 'remote', 'get-url', 'origin'], 
                                  capture_output=True, text=True, cwd=self.base_path)
            
            if result.returncode == 0:
                origin_url = result.stdout.strip()
                self.log_audit(f"Origin URL: {origin_url}", "INFO", "GITHUB")
                self.results['github']['origin_url'] = origin_url
                
        except Exception as e:
            self.log_audit(f"GitHub audit failed: {e}", "ERROR", "GITHUB")
            
    def audit_vercel_deployment(self):
        """Audit Vercel deployment by testing the live site"""
        self.log_audit("Starting Vercel Deployment Audit", "INFO", "VERCEL")
        
        vercel_urls = [
            'https://www.rugrel.in',
            'https://medixscan.vercel.app',
            'https://medixscan-rug.vercel.app'
        ]
        
        for url in vercel_urls:
            try:
                self.log_audit(f"Testing Vercel URL: {url}", "INFO", "VERCEL")
                
                response = requests.get(url, timeout=10, allow_redirects=True)
                
                if response.status_code == 200:
                    self.log_audit(f"✅ {url} - Status: {response.status_code}", "SUCCESS", "VERCEL")
                    self.results['vercel'][url] = {
                        'status': response.status_code,
                        'accessible': True,
                        'content_length': len(response.content)
                    }
                    
                    # Check if it's actually the MediXScan app
                    if 'MediXScan' in response.text or 'rugrel' in response.text:
                        self.log_audit(f"✅ {url} contains MediXScan content", "SUCCESS", "VERCEL")
                    else:
                        self.log_audit(f"⚠️ {url} may not be the correct app", "WARNING", "VERCEL")
                        
                else:
                    self.log_audit(f"❌ {url} - Status: {response.status_code}", "ERROR", "VERCEL")
                    self.results['vercel'][url] = {
                        'status': response.status_code,
                        'accessible': False
                    }
                    
            except Exception as e:
                self.log_audit(f"Failed to reach {url}: {e}", "ERROR", "VERCEL")
                self.results['vercel'][url] = {
                    'status': 'ERROR',
                    'accessible': False,
                    'error': str(e)
                }
                
    def audit_railway_backend(self):
        """Audit Railway backend"""
        self.log_audit("Starting Railway Backend Audit", "INFO", "RAILWAY")
        
        railway_api = 'https://medixscan-production.up.railway.app/api'
        
        try:
            # Test basic connectivity
            self.log_audit(f"Testing Railway API: {railway_api}", "INFO", "RAILWAY")
            
            response = requests.get(f"{railway_api}/health/", timeout=10)
            
            if response.status_code == 200:
                self.log_audit("✅ Railway API health check passed", "SUCCESS", "RAILWAY")
                self.results['railway']['health_check'] = True
            else:
                self.log_audit(f"⚠️ Railway health check: {response.status_code}", "WARNING", "RAILWAY")
                self.results['railway']['health_check'] = False
                
            # Test authentication endpoints
            auth_endpoints = ['/auth/login/', '/auth/emergency-login/', '/auth/simple-login/']
            
            for endpoint in auth_endpoints:
                try:
                    url = f"{railway_api}{endpoint}"
                    response = requests.post(
                        url,
                        json={'email': 'test@test.com', 'password': 'test'},
                        headers={'Content-Type': 'application/json'},
                        timeout=10
                    )
                    
                    self.log_audit(f"Auth endpoint {endpoint}: {response.status_code}", "INFO", "RAILWAY")
                    self.results['railway'][f'auth_{endpoint.replace("/", "_")}'] = response.status_code
                    
                except Exception as e:
                    self.log_audit(f"Auth endpoint {endpoint} error: {e}", "WARNING", "RAILWAY")
                    
            # Test CORS headers
            try:
                response = requests.options(
                    f"{railway_api}/auth/login/",
                    headers={
                        'Origin': 'https://www.rugrel.in',
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'Content-Type'
                    },
                    timeout=10
                )
                
                cors_header = response.headers.get('Access-Control-Allow-Origin')
                self.log_audit(f"CORS Allow-Origin: {cors_header}", "INFO", "RAILWAY")
                self.results['railway']['cors_allow_origin'] = cors_header
                
            except Exception as e:
                self.log_audit(f"CORS test failed: {e}", "WARNING", "RAILWAY")
                
        except Exception as e:
            self.log_audit(f"Railway audit failed: {e}", "ERROR", "RAILWAY")
            
    def test_login_flow(self):
        """Test the actual login flow end-to-end"""
        self.log_audit("Testing Complete Login Flow", "INFO", "LOGIN")
        
        # Test credentials
        credentials = {
            'email': 'tanzeem.agra@rugrel.com',
            'password': 'Tanzilla@tanzeem786'
        }
        
        railway_api = 'https://medixscan-production.up.railway.app/api'
        
        # Test emergency login (the working one)
        try:
            self.log_audit("Testing emergency login with actual credentials...", "INFO", "LOGIN")
            
            response = requests.post(
                f"{railway_api}/auth/emergency-login/",
                json=credentials,
                headers={
                    'Content-Type': 'application/json',
                    'Origin': 'https://www.rugrel.in'
                },
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'token' in data:
                    self.log_audit("✅ Emergency login SUCCESS - Token received!", "SUCCESS", "LOGIN")
                    self.results['login_test'] = {
                        'emergency_login': True,
                        'token_received': True,
                        'user_id': data.get('user', {}).get('id')
                    }
                    return True
                else:
                    self.log_audit(f"⚠️ Login success but no token: {data}", "WARNING", "LOGIN")
            else:
                error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                self.log_audit(f"❌ Emergency login failed: {response.status_code} - {error_data}", "ERROR", "LOGIN")
                
        except Exception as e:
            self.log_audit(f"Login test failed: {e}", "ERROR", "LOGIN")
            
        return False
        
    def generate_comprehensive_fix(self):
        """Generate comprehensive fix based on audit results"""
        self.log_audit("Generating Comprehensive Fix Plan", "FIX", "SOLUTION")
        
        fixes = []
        
        # Check if emergency login is working
        if self.results.get('login_test', {}).get('emergency_login'):
            fixes.append("✅ Emergency login endpoint is working - this confirms backend is functional")
        else:
            fixes.append("❌ Emergency login endpoint not working - backend issue detected")
            
        # Check Vercel deployment
        vercel_working = False
        for url, data in self.results.get('vercel', {}).items():
            if data.get('accessible'):
                vercel_working = True
                fixes.append(f"✅ Vercel deployment accessible at: {url}")
                break
                
        if not vercel_working:
            fixes.append("❌ Vercel deployment not accessible - deployment issue")
            
        # Check Railway status
        if self.results.get('railway', {}).get('health_check'):
            fixes.append("✅ Railway backend is healthy")
        else:
            fixes.append("❌ Railway backend health check failed")
            
        # Check CORS
        cors_origin = self.results.get('railway', {}).get('cors_allow_origin')
        if cors_origin in ['*', 'https://www.rugrel.in']:
            fixes.append("✅ CORS configuration allows www.rugrel.in")
        else:
            fixes.append(f"❌ CORS issue detected - Allow-Origin: {cors_origin}")
            
        return fixes
        
    def run_complete_audit(self):
        """Run complete platform audit"""
        self.log_audit("🚀 Starting Comprehensive Platform Audit", "INFO", "AUDIT")
        
        # Run all audits
        self.audit_local_environment()
        self.audit_github_repository()
        self.audit_vercel_deployment()
        self.audit_railway_backend()
        login_success = self.test_login_flow()
        
        # Generate summary
        self.log_audit("\n" + "="*60, "INFO", "SUMMARY")
        self.log_audit("📋 AUDIT SUMMARY", "INFO", "SUMMARY")
        self.log_audit("="*60, "INFO", "SUMMARY")
        
        fixes = self.generate_comprehensive_fix()
        for fix in fixes:
            self.log_audit(fix, "FIX", "SUMMARY")
            
        # Final recommendations
        self.log_audit("\n🎯 IMMEDIATE ACTION REQUIRED:", "FIX", "ACTION")
        
        if login_success:
            self.log_audit("1. ✅ Backend authentication is working via emergency endpoint", "SUCCESS", "ACTION")
            self.log_audit("2. 🔧 Frontend needs to use emergency endpoint consistently", "FIX", "ACTION")
            self.log_audit("3. 🌐 Check if Vercel deployment has latest code", "FIX", "ACTION")
        else:
            self.log_audit("1. 🚨 Backend authentication is broken", "ERROR", "ACTION")
            self.log_audit("2. 🔧 Fix Railway environment variables", "FIX", "ACTION")
            self.log_audit("3. 🔧 Check Railway deployment logs", "FIX", "ACTION")
            
        return self.results

if __name__ == "__main__":
    auditor = PlatformAuditor()
    results = auditor.run_complete_audit()
    
    # Save results to file
    with open(r'D:\radiology_v2\platform_audit_results.json', 'w') as f:
        json.dump(results, f, indent=2)
        
    print(f"\n📊 Detailed results saved to: D:\\radiology_v2\\platform_audit_results.json")