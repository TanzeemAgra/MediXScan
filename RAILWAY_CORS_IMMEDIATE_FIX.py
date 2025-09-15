#!/usr/bin/env python3
"""
🚨 RAILWAY CORS IMMEDIATE FIX
Auto-generate Railway environment variables to fix CORS blocking
"""

import json
import os
from datetime import datetime

class RailwayCORSFixer:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def get_all_vercel_domains(self):
        """Get comprehensive list of all Vercel domains that need CORS access"""
        return [
            # Main production domains
            "https://www.rugrel.in",
            "https://rugrel.in", 
            "https://medixscan.vercel.app",
            
            # Vercel deployment domains (from error logs)
            "https://medixscan-git-main-xerxezs-projects.vercel.app",
            "https://medixscan-rug.vercel.app",
            
            # Development domains
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            
            # Additional Vercel preview domains
            "https://medixscan-tanzeemun.vercel.app",
            "https://medixscan-git-main.vercel.app",
        ]
    
    def get_all_allowed_hosts(self):
        """Get comprehensive list of allowed hosts"""
        return [
            # Railway domains
            "medixscan-production.up.railway.app",
            "*.railway.app",
            
            # Custom domains
            "rugrel.in",
            "*.rugrel.in", 
            "www.rugrel.in",
            "api.rugrel.in",
            
            # Vercel domains
            "*.vercel.app",
            "medixscan.vercel.app",
            "medixscan-git-main-xerxezs-projects.vercel.app",
            "medixscan-rug.vercel.app",
            
            # Development
            "localhost",
            "127.0.0.1",
        ]
    
    def generate_railway_env_vars(self):
        """Generate complete Railway environment variables"""
        cors_origins = ",".join(self.get_all_vercel_domains())
        allowed_hosts = ",".join(self.get_all_allowed_hosts())
        
        env_vars = {
            # 🚨 CRITICAL CORS FIX
            "CORS_ALLOW_ALL_ORIGINS": "True",
            "CORS_ALLOWED_ORIGINS": cors_origins,
            "CORS_ALLOW_CREDENTIALS": "True",
            "CORS_ALLOW_HEADERS": "accept,accept-encoding,authorization,content-type,dnt,origin,user-agent,x-csrftoken,x-requested-with",
            "CORS_ALLOW_METHODS": "DELETE,GET,OPTIONS,PATCH,POST,PUT",
            
            # 🌐 ALLOWED HOSTS FIX  
            "ALLOWED_HOSTS": allowed_hosts,
            
            # 🔒 SECURITY HEADERS
            "SECURE_CROSS_ORIGIN_OPENER_POLICY": "same-origin-allow-popups",
            "SECURE_REFERRER_POLICY": "strict-origin-when-cross-origin",
            
            # 🐛 DEBUG (temporary for verification)
            "DEBUG": "True",
            "DJANGO_LOG_LEVEL": "INFO",
            
            # 🛡️ CSRF SETTINGS  
            "CSRF_TRUSTED_ORIGINS": cors_origins,
            "CSRF_COOKIE_SECURE": "False",  # Temporary for testing
            "SESSION_COOKIE_SECURE": "False",  # Temporary for testing
        }
        
        return env_vars
    
    def generate_railway_commands(self):
        """Generate Railway CLI commands to set environment variables"""
        env_vars = self.generate_railway_env_vars()
        
        commands = []
        commands.append("# 🚨 RAILWAY CORS FIX - Execute these commands:")
        commands.append("# Install Railway CLI if not installed: npm install -g @railway/cli")
        commands.append("railway login")
        commands.append("railway link medixscan-production")
        commands.append("")
        
        for key, value in env_vars.items():
            # Escape quotes in values
            escaped_value = str(value).replace('"', '\\"')
            commands.append(f'railway variables set {key}="{escaped_value}"')
        
        commands.append("")
        commands.append("# 🔄 Force redeploy after setting variables:")
        commands.append("railway redeploy")
        
        return "\n".join(commands)
    
    def generate_manual_instructions(self):
        """Generate manual Railway dashboard instructions"""
        env_vars = self.generate_railway_env_vars()
        
        instructions = [
            "# 🚨 MANUAL RAILWAY DASHBOARD FIX",
            "",
            "## Step 1: Go to Railway Dashboard",
            "1. Visit: https://railway.app/dashboard",
            "2. Select project: medixscan-production", 
            "3. Go to: Variables tab",
            "",
            "## Step 2: Add/Update these Environment Variables:",
            ""
        ]
        
        for key, value in env_vars.items():
            instructions.append(f"**{key}**")
            instructions.append(f"```")
            instructions.append(str(value))
            instructions.append(f"```")
            instructions.append("")
        
        instructions.extend([
            "## Step 3: Deploy",
            "Click 'Deploy' or wait for auto-redeploy",
            "",
            "## Step 4: Test",
            "After 2-3 minutes, test login at:",
            "- https://medixscan-git-main-xerxezs-projects.vercel.app/auth/sign-in", 
            "- https://www.rugrel.in/auth/sign-in",
            "",
            "✅ CORS errors should be resolved!"
        ])
        
        return "\n".join(instructions)
    
    def save_fix_files(self):
        """Save all fix files"""
        
        # Save Railway CLI commands
        cli_commands = self.generate_railway_commands()
        with open("RAILWAY_CLI_FIX.sh", "w", encoding="utf-8") as f:
            f.write(cli_commands)
        
        # Save manual instructions
        manual_instructions = self.generate_manual_instructions()
        with open("RAILWAY_MANUAL_FIX.md", "w", encoding="utf-8") as f:
            f.write(manual_instructions)
        
        # Save environment variables as JSON
        env_vars = self.generate_railway_env_vars()
        with open("railway_env_vars.json", "w", encoding="utf-8") as f:
            json.dump(env_vars, f, indent=2)
        
        print("🚨 RAILWAY CORS FIX FILES CREATED:")
        print("✅ RAILWAY_CLI_FIX.sh - Railway CLI commands")
        print("✅ RAILWAY_MANUAL_FIX.md - Manual dashboard instructions")  
        print("✅ railway_env_vars.json - Environment variables")
        print("")
        print("🔥 IMMEDIATE ACTION: Use either CLI or Manual method!")
        print("")
        print("⚡ CLI Method (Fastest):")
        print("   powershell -File RAILWAY_CLI_FIX.sh")
        print("")
        print("🌐 Manual Method:")
        print("   Follow instructions in RAILWAY_MANUAL_FIX.md")
        
        return {
            "cli_file": "RAILWAY_CLI_FIX.sh",
            "manual_file": "RAILWAY_MANUAL_FIX.md", 
            "env_file": "railway_env_vars.json",
            "env_vars": env_vars
        }

def main():
    print("🚨 RAILWAY CORS IMMEDIATE FIX GENERATOR")
    print("=====================================")
    
    fixer = RailwayCORSFixer()
    results = fixer.save_fix_files()
    
    print("\n🎯 ROOT CAUSE:")
    print("   Railway missing CORS headers for Vercel domains")
    print("   Specifically: medixscan-git-main-xerxezs-projects.vercel.app")
    
    print("\n💡 SOLUTION:")
    print("   Add CORS_ALLOW_ALL_ORIGINS=True to Railway")
    print("   Add all Vercel domains to CORS_ALLOWED_ORIGINS")
    
    print("\n⏰ ETA: 2-3 minutes after applying fix")
    
    return results

if __name__ == "__main__":
    main()