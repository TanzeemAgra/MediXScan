#!/usr/bin/env python3
"""
Deployment Readiness Validator
=============================
Validates all configurations are ready for Railway and Vercel deployment
"""

import os
import sys
import json
from pathlib import Path

def check_backend_config():
    """Check backend configuration files"""
    backend_dir = Path("backend")
    issues = []
    
    # Check essential files
    required_files = [
        "backend/.env.production",
        "backend/config_management.py", 
        "backend/setup_railway_admin.py",
        "railway.toml"
    ]
    
    for file_path in required_files:
        if not Path(file_path).exists():
            issues.append(f"❌ Missing: {file_path}")
        else:
            print(f"✅ Found: {file_path}")
    
    # Check .env.production content
    env_prod = Path("backend/.env.production")
    if env_prod.exists():
        content = env_prod.read_text()
        if "RAILWAY_ENVIRONMENT=production" in content:
            print("✅ Railway environment configured")
        else:
            issues.append("❌ Railway environment not configured in .env.production")
            
        if "medixscan-production.up.railway.app" in content:
            print("✅ Railway API endpoint configured")
        else:
            issues.append("❌ Railway API endpoint not configured")
    
    return issues

def check_frontend_config():
    """Check frontend configuration files"""
    issues = []
    
    # Check essential files
    required_files = [
        "frontend/.env.production",
        "frontend/src/config/smartApiConfig.js",
        ".github/workflows/deploy-frontend.yml"
    ]
    
    for file_path in required_files:
        if not Path(file_path).exists():
            issues.append(f"❌ Missing: {file_path}")
        else:
            print(f"✅ Found: {file_path}")
    
    # Check frontend .env.production
    env_prod = Path("frontend/.env.production")
    if env_prod.exists():
        content = env_prod.read_text()
        if "medixscan-production.up.railway.app" in content:
            print("✅ Frontend API endpoint configured")
        else:
            issues.append("❌ Frontend API endpoint not configured")
    
    return issues

def check_deployment_config():
    """Check deployment configuration"""
    issues = []
    
    # Check railway.toml
    railway_config = Path("railway.toml")
    if railway_config.exists():
        content = railway_config.read_text()
        if "startCommand" in content and "migrate" in content:
            print("✅ Railway start command includes migrations")
        else:
            issues.append("❌ Railway start command missing or incomplete")
    
    # Check GitHub workflow
    workflow = Path(".github/workflows/deploy-frontend.yml")
    if workflow.exists():
        content = workflow.read_text()
        if "medixscan-production.up.railway.app" in content:
            print("✅ GitHub workflow API endpoint configured")
        else:
            issues.append("❌ GitHub workflow API endpoint not configured")
    
    return issues

def main():
    """Main validation function"""
    print("🚀 MediXScan Deployment Readiness Check")
    print("=" * 50)
    
    all_issues = []
    
    print("\n📋 Backend Configuration:")
    all_issues.extend(check_backend_config())
    
    print("\n🎨 Frontend Configuration:")
    all_issues.extend(check_frontend_config())
    
    print("\n🚀 Deployment Configuration:")
    all_issues.extend(check_deployment_config())
    
    print("\n" + "=" * 50)
    
    if not all_issues:
        print("✅ ALL CHECKS PASSED! Ready for deployment")
        print("\n🎯 Deployment Instructions:")
        print("1. Push to main branch: git add . && git commit -m 'Deploy' && git push")
        print("2. Railway will auto-deploy backend")
        print("3. GitHub Actions will deploy frontend to Vercel")
        print("4. Test login at: https://www.rugrel.in/auth/sign-in")
        print("5. Super Admin: tanzeem.agra@rugrel.com / Tanzilla@tanzeem786")
        return True
    else:
        print("❌ ISSUES FOUND:")
        for issue in all_issues:
            print(f"  {issue}")
        print(f"\n🔧 Please fix {len(all_issues)} issue(s) before deployment")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)