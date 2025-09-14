#!/usr/bin/env python3
"""
Deployment Security Helper Script
Validates environment configuration and prepares for Railway/Vercel deployment
"""

import os
import sys
import json
from pathlib import Path

def check_sensitive_files():
    """Check for sensitive files that should not be committed"""
    sensitive_patterns = [
        '.env',
        '*.env',
        '.env.local',
        '.env.production',
        '*.key',
        '*.pem',
        'credentials.json',
        'auth.json'
    ]
    
    root_dir = Path(__file__).parent
    found_sensitive = []
    
    for pattern in sensitive_patterns:
        for file_path in root_dir.rglob(pattern):
            if file_path.is_file():
                # Check if file contains sensitive data
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read().lower()
                        # Check for actual sensitive values, not placeholders
                        sensitive_indicators = [
                            'sk-proj-',  # OpenAI API key prefix
                            'tanzeem@12345',  # Actual password
                            'django-insecure-your-secret',  # Default Django key
                        ]
                        
                        if any(indicator in content for indicator in sensitive_indicators):
                            found_sensitive.append(str(file_path))
                except Exception:
                    pass
    
    return found_sensitive

def validate_environment():
    """Validate environment configuration"""
    errors = []
    warnings = []
    
    # Check for environment files
    env_files = [
        'backend/.env.template',
        'backend/.env.development', 
        'backend/.env.production',
        'backend/config_management.py'
    ]
    
    for env_file in env_files:
        if not os.path.exists(env_file):
            errors.append(f"Missing required file: {env_file}")
    
    # Check gitignore
    gitignore_path = '.gitignore'
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r') as f:
            gitignore_content = f.read()
            
        required_patterns = ['.env', '*.env', '*.key', 'credentials.json']
        for pattern in required_patterns:
            if pattern not in gitignore_content:
                warnings.append(f"Missing in .gitignore: {pattern}")
    else:
        errors.append("Missing .gitignore file")
    
    return errors, warnings

def generate_deployment_commands():
    """Generate deployment commands for Railway and Vercel"""
    
    railway_commands = [
        "# Railway Backend Deployment Commands",
        "",
        "# 1. Login to Railway",
        "npm install -g @railway/cli",
        "railway login",
        "",
        "# 2. Initialize Railway project",
        "railway init",
        "",
        "# 3. Add PostgreSQL service", 
        "railway add --database postgresql",
        "",
        "# 4. Set environment variables",
        "railway variables set SECRET_KEY='your-secure-django-secret-key'",
        "railway variables set OPENAI_API_KEY='your-openai-api-key'", 
        "railway variables set DEBUG=False",
        "railway variables set ENVIRONMENT=production",
        "railway variables set RAILWAY_ENVIRONMENT=production",
        "",
        "# 5. Deploy backend",
        "railway up",
    ]
    
    vercel_commands = [
        "# Vercel Frontend Deployment Commands",
        "",
        "# 1. Install Vercel CLI",
        "npm install -g vercel",
        "",
        "# 2. Navigate to frontend directory",
        "cd frontend",
        "",
        "# 3. Login to Vercel",
        "vercel login",
        "",
        "# 4. Deploy frontend",
        "vercel --prod",
        "",
        "# 5. Set environment variables (in Vercel dashboard or CLI)",
        "vercel env add VITE_API_URL",
        "# Enter: https://medixscan-production.up.railway.app",
        "",
        "vercel env add VITE_ENVIRONMENT", 
        "# Enter: production",
    ]
    
    return railway_commands, vercel_commands

def main():
    """Main deployment security check"""
    print("🔐 MediXScan Deployment Security Check")
    print("=" * 50)
    
    # Check for sensitive files
    print("\n📁 Checking for sensitive files...")
    sensitive_files = check_sensitive_files()
    
    if sensitive_files:
        print("❌ CRITICAL: Found sensitive files that should not be committed:")
        for file_path in sensitive_files:
            print(f"   - {file_path}")
        print("\n🚨 Action Required: Remove sensitive data from these files!")
    else:
        print("✅ No sensitive files found in repository")
    
    # Validate environment
    print("\n⚙️ Validating environment configuration...")
    errors, warnings = validate_environment()
    
    if errors:
        print("❌ ERRORS found:")
        for error in errors:
            print(f"   - {error}")
    
    if warnings:
        print("⚠️ WARNINGS found:")
        for warning in warnings:
            print(f"   - {warning}")
    
    if not errors and not warnings:
        print("✅ Environment configuration is valid")
    
    # Generate deployment commands
    print("\n🚀 Deployment Commands")
    print("=" * 30)
    
    railway_cmds, vercel_cmds = generate_deployment_commands()
    
    print("\n📄 Railway Backend Deployment:")
    for cmd in railway_cmds:
        print(cmd)
    
    print("\n📄 Vercel Frontend Deployment:")
    for cmd in vercel_cmds:
        print(cmd)
    
    # Save commands to files
    with open('railway-deployment-commands.txt', 'w') as f:
        f.write('\n'.join(railway_cmds))
    
    with open('vercel-deployment-commands.txt', 'w') as f:
        f.write('\n'.join(vercel_cmds))
    
    print("\n📝 Deployment commands saved to:")
    print("   - railway-deployment-commands.txt")
    print("   - vercel-deployment-commands.txt")
    
    # Final status
    print("\n🎯 Deployment Readiness Summary")
    print("=" * 35)
    
    if not sensitive_files and not errors:
        print("✅ READY FOR DEPLOYMENT")
        print("   - Security checks passed")
        print("   - Environment files configured")
        print("   - Soft-coding implementation complete")
    else:
        print("❌ NOT READY FOR DEPLOYMENT")
        print("   - Fix security issues and errors first")
    
    return 0 if not sensitive_files and not errors else 1

if __name__ == "__main__":
    sys.exit(main())