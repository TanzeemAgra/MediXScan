#!/usr/bin/env python3
"""
🔍 COMPREHENSIVE PLATFORM DIAGNOSIS
Deep analysis of Railway backend, database, and all endpoints
"""

import requests
import json
import time
from datetime import datetime
import subprocess
import os

class CompletePlatformDiagnosis:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.results = {}
        
    def check_railway_service_health(self):
        """Deep Railway service analysis"""
        print("🔍 DEEP RAILWAY SERVICE ANALYSIS")
        print("=" * 50)
        
        results = {}
        base_urls = [
            "https://medixscan-production.up.railway.app",
            "https://api.rugrel.in"
        ]
        
        for base_url in base_urls:
            print(f"\n📡 Testing: {base_url}")
            
            # Test basic connectivity
            try:
                response = requests.get(f"{base_url}/api/", timeout=10)
                results[f"{base_url}_basic"] = {
                    "status": response.status_code,
                    "headers": dict(response.headers),
                    "accessible": True
                }
                print(f"✅ Basic connectivity: {response.status_code}")
            except Exception as e:
                results[f"{base_url}_basic"] = {
                    "accessible": False,
                    "error": str(e)
                }
                print(f"❌ Basic connectivity failed: {e}")
                continue
            
            # Test health endpoint
            try:
                response = requests.get(f"{base_url}/api/health/", timeout=10)
                results[f"{base_url}_health"] = {
                    "status": response.status_code,
                    "response": response.text[:200] if response.text else "No response body"
                }
                print(f"✅ Health check: {response.status_code}")
            except Exception as e:
                results[f"{base_url}_health"] = {"error": str(e)}
                print(f"❌ Health check failed: {e}")
            
            # Test auth endpoints
            auth_endpoints = ["/api/auth/check/", "/api/auth/login/", "/api/auth/emergency-login/"]
            for endpoint in auth_endpoints:
                try:
                    response = requests.get(f"{base_url}{endpoint}", timeout=10)
                    results[f"{base_url}{endpoint}"] = {
                        "status": response.status_code,
                        "method": "GET"
                    }
                    print(f"✅ {endpoint}: {response.status_code}")
                except Exception as e:
                    results[f"{base_url}{endpoint}"] = {"error": str(e)}
                    print(f"❌ {endpoint}: {e}")
        
        self.results["railway_health"] = results
        return results
    
    def test_database_connectivity(self):
        """Test PostgreSQL database connectivity"""
        print("\n🗄️ DATABASE CONNECTIVITY TEST")
        print("=" * 50)
        
        results = {}
        
        # Test database via Railway CLI
        try:
            print("📋 Getting Railway database info...")
            db_result = subprocess.run(
                ["railway", "variables"], 
                capture_output=True, 
                text=True,
                timeout=30
            )
            
            if db_result.returncode == 0:
                results["railway_vars"] = db_result.stdout
                print("✅ Railway variables accessible")
                
                # Extract database URL from variables
                if "DATABASE_URL" in db_result.stdout:
                    print("✅ DATABASE_URL found in Railway variables")
                    results["database_url_present"] = True
                else:
                    print("❌ DATABASE_URL missing from Railway variables")
                    results["database_url_present"] = False
            else:
                results["railway_vars_error"] = db_result.stderr
                print(f"❌ Railway variables error: {db_result.stderr}")
                
        except Exception as e:
            results["railway_cli_error"] = str(e)
            print(f"❌ Railway CLI error: {e}")
        
        # Test database connection via API
        try:
            print("🔌 Testing database via API...")
            response = requests.get(
                "https://medixscan-production.up.railway.app/api/auth/check/",
                timeout=15
            )
            results["db_via_api"] = {
                "status": response.status_code,
                "response": response.text[:200]
            }
            print(f"✅ Database via API: {response.status_code}")
        except Exception as e:
            results["db_via_api_error"] = str(e)
            print(f"❌ Database via API failed: {e}")
        
        self.results["database"] = results
        return results
    
    def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 AUTHENTICATION FLOW TEST")
        print("=" * 50)
        
        results = {}
        test_credentials = {
            "username": "tanzeem.agra@rugrel.com",
            "password": "Tanzilla@tanzeem786"
        }
        
        base_urls = [
            "https://medixscan-production.up.railway.app/api",
            "https://api.rugrel.in/api"
        ]
        
        endpoints = [
            "/auth/emergency-login/",
            "/auth/login/",
            "/auth/simple-login/"
        ]
        
        for base_url in base_urls:
            print(f"\n🌐 Testing authentication on: {base_url}")
            
            for endpoint in endpoints:
                url = f"{base_url}{endpoint}"
                print(f"🔑 Testing: {endpoint}")
                
                try:
                    response = requests.post(
                        url,
                        json=test_credentials,
                        headers={
                            "Content-Type": "application/json",
                            "Origin": "https://medixscan-git-main-xerxezs-projects.vercel.app"
                        },
                        timeout=15
                    )
                    
                    results[f"{base_url}{endpoint}"] = {
                        "status": response.status_code,
                        "headers": dict(response.headers),
                        "response": response.text[:300],
                        "has_cors_headers": "Access-Control-Allow-Origin" in response.headers
                    }
                    
                    if response.status_code == 200:
                        print(f"✅ {endpoint}: SUCCESS ({response.status_code})")
                    elif response.status_code in [401, 403]:
                        print(f"🔐 {endpoint}: Auth issue ({response.status_code})")
                    else:
                        print(f"⚠️ {endpoint}: {response.status_code}")
                        
                except Exception as e:
                    results[f"{base_url}{endpoint}_error"] = str(e)
                    print(f"❌ {endpoint}: {e}")
        
        self.results["authentication"] = results
        return results
    
    def check_user_account_status(self):
        """Check if user account exists and is approved"""
        print("\n👤 USER ACCOUNT STATUS CHECK")
        print("=" * 50)
        
        results = {}
        
        # Try to get user info via API
        endpoints_to_test = [
            "/api/auth/user-status/",
            "/api/users/",
            "/api/auth/check/"
        ]
        
        for endpoint in endpoints_to_test:
            try:
                url = f"https://medixscan-production.up.railway.app{endpoint}"
                response = requests.get(url, timeout=10)
                
                results[endpoint] = {
                    "status": response.status_code,
                    "response": response.text[:200]
                }
                print(f"✅ {endpoint}: {response.status_code}")
                
            except Exception as e:
                results[f"{endpoint}_error"] = str(e)
                print(f"❌ {endpoint}: {e}")
        
        self.results["user_account"] = results
        return results
    
    def network_trace_analysis(self):
        """Analyze network path and DNS resolution"""
        print("\n🌐 NETWORK TRACE ANALYSIS")
        print("=" * 50)
        
        results = {}
        
        # DNS resolution tests
        domains = [
            "medixscan-production.up.railway.app",
            "api.rugrel.in",
            "www.rugrel.in"
        ]
        
        for domain in domains:
            try:
                print(f"🔍 DNS lookup: {domain}")
                dns_result = subprocess.run(
                    ["nslookup", domain], 
                    capture_output=True, 
                    text=True,
                    timeout=15
                )
                results[f"dns_{domain}"] = {
                    "success": dns_result.returncode == 0,
                    "output": dns_result.stdout,
                    "error": dns_result.stderr
                }
                
                if dns_result.returncode == 0:
                    print(f"✅ {domain} resolves")
                else:
                    print(f"❌ {domain} DNS failed")
                    
            except Exception as e:
                results[f"dns_{domain}_error"] = str(e)
                print(f"❌ DNS lookup failed for {domain}: {e}")
        
        # Connectivity tests
        urls_to_ping = [
            "https://medixscan-production.up.railway.app",
            "https://api.rugrel.in"
        ]
        
        for url in urls_to_ping:
            try:
                print(f"🏓 Connectivity test: {url}")
                response = requests.head(url, timeout=10)
                results[f"connectivity_{url}"] = {
                    "status": response.status_code,
                    "time": response.elapsed.total_seconds()
                }
                print(f"✅ {url}: {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
                
            except Exception as e:
                results[f"connectivity_{url}_error"] = str(e)
                print(f"❌ {url}: {e}")
        
        self.results["network"] = results
        return results
    
    def generate_solution_recommendations(self):
        """Generate specific recommendations based on diagnosis"""
        print("\n🎯 SOLUTION RECOMMENDATIONS")
        print("=" * 50)
        
        recommendations = []
        
        # Analyze results and generate recommendations
        if "railway_health" in self.results:
            railway_results = self.results["railway_health"]
            
            # Check if any Railway endpoints are accessible
            railway_accessible = any(
                result.get("accessible", False) 
                for key, result in railway_results.items() 
                if "_basic" in key
            )
            
            if not railway_accessible:
                recommendations.append({
                    "priority": "CRITICAL",
                    "issue": "Railway backend completely inaccessible",
                    "solution": "Check Railway service status and redeploy backend"
                })
        
        if "database" in self.results:
            db_results = self.results["database"]
            
            if not db_results.get("database_url_present", False):
                recommendations.append({
                    "priority": "CRITICAL", 
                    "issue": "Database URL missing from Railway variables",
                    "solution": "Add DATABASE_URL to Railway environment variables"
                })
        
        if "authentication" in self.results:
            auth_results = self.results["authentication"]
            
            # Check if any auth endpoints work
            auth_working = any(
                result.get("status") == 200
                for result in auth_results.values()
                if isinstance(result, dict) and "status" in result
            )
            
            if not auth_working:
                recommendations.append({
                    "priority": "HIGH",
                    "issue": "All authentication endpoints failing",
                    "solution": "Check Django authentication configuration and database connection"
                })
        
        self.results["recommendations"] = recommendations
        
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. [{rec['priority']}] {rec['issue']}")
            print(f"   Solution: {rec['solution']}")
            print()
        
        return recommendations
    
    def save_diagnosis_report(self):
        """Save complete diagnosis report"""
        report_file = f"complete_diagnosis_{self.timestamp}.json"
        
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(self.results, f, indent=2, default=str)
        
        print(f"📊 Complete diagnosis saved to: {report_file}")
        return report_file
    
    def run_complete_diagnosis(self):
        """Run all diagnostic tests"""
        print("🚨 COMPLETE PLATFORM DIAGNOSIS")
        print("=" * 60)
        print(f"Timestamp: {self.timestamp}")
        print("=" * 60)
        
        # Run all tests
        self.check_railway_service_health()
        self.test_database_connectivity()
        self.test_authentication_flow()
        self.check_user_account_status()
        self.network_trace_analysis()
        
        # Generate recommendations
        self.generate_solution_recommendations()
        
        # Save report
        report_file = self.save_diagnosis_report()
        
        print("\n🎯 DIAGNOSIS COMPLETE")
        print("=" * 60)
        print(f"Full report: {report_file}")
        
        return self.results

def main():
    print("🔍 Starting Complete Platform Diagnosis...")
    print("This will check Railway, database, authentication, and network connectivity")
    print()
    
    diagnosis = CompletePlatformDiagnosis()
    results = diagnosis.run_complete_diagnosis()
    
    print("\n🚨 NEXT STEPS:")
    print("1. Review the recommendations above")
    print("2. Check the detailed JSON report")
    print("3. Apply the suggested fixes in order of priority")
    
    return results

if __name__ == "__main__":
    main()