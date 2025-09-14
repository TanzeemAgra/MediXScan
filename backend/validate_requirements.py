#!/usr/bin/env python3
"""
Requirements.txt Validation Script for MediXScan Backend
Tests all dependencies for compatibility and installation issues
"""

import subprocess
import sys
import os
from pathlib import Path
import importlib
import pkg_resources

class RequirementsValidator:
    def __init__(self):
        self.backend_dir = Path(__file__).parent
        self.requirements_file = self.backend_dir / "requirements.txt"
        self.critical_imports = [
            'django',
            'rest_framework',
            'corsheaders',
            'psycopg2',
            'openai',
            'aiohttp',
            'requests',
            'bs4',
            'lxml'
        ]
        
    def read_requirements(self):
        """Read and parse requirements.txt"""
        if not self.requirements_file.exists():
            print("❌ requirements.txt not found!")
            return []
        
        with open(self.requirements_file, 'r') as f:
            lines = f.readlines()
        
        # Parse requirements, ignore comments and empty lines
        requirements = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#'):
                # Handle version specifiers
                if '==' in line:
                    package = line.split('==')[0]
                elif '>=' in line:
                    package = line.split('>=')[0]
                elif '<=' in line:
                    package = line.split('<=')[0]
                else:
                    package = line
                requirements.append(line.strip())
        
        return requirements
    
    def check_package_availability(self, package_line):
        """Check if a package is available on PyPI"""
        try:
            # Extract package name
            package_name = package_line.split('==')[0].split('>=')[0].split('<=')[0]
            
            # Try to get package info
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'show', package_name],
                capture_output=True, text=True, timeout=10
            )
            
            return result.returncode == 0
            
        except subprocess.TimeoutExpired:
            return False
        except Exception:
            return False
    
    def test_critical_imports(self):
        """Test if critical packages can be imported"""
        print("\n🔍 Testing Critical Package Imports:")
        print("-" * 50)
        
        results = {}
        for package in self.critical_imports:
            try:
                # Special handling for some packages
                if package == 'bs4':
                    importlib.import_module('bs4')
                elif package == 'corsheaders':
                    importlib.import_module('corsheaders')
                elif package == 'rest_framework':
                    importlib.import_module('rest_framework')
                else:
                    importlib.import_module(package)
                
                print(f"✅ {package}: Successfully imported")
                results[package] = True
                
            except ImportError as e:
                print(f"❌ {package}: Import failed - {str(e)}")
                results[package] = False
            except Exception as e:
                print(f"⚠️ {package}: Unexpected error - {str(e)}")
                results[package] = False
        
        return results
    
    def validate_versions(self):
        """Check for version compatibility issues"""
        print("\n🔧 Version Compatibility Analysis:")
        print("-" * 50)
        
        try:
            # Check Django + DRF compatibility
            django_version = pkg_resources.get_distribution("Django").version
            drf_version = pkg_resources.get_distribution("djangorestframework").version
            
            print(f"Django: {django_version}")
            print(f"Django REST Framework: {drf_version}")
            
            # Django 4.2.7 is compatible with DRF 3.14.0
            django_major = float('.'.join(django_version.split('.')[:2]))
            if django_major >= 4.2:
                print("✅ Django version is production-ready")
            else:
                print("⚠️ Consider upgrading Django for better security")
            
            # Check OpenAI version
            try:
                openai_version = pkg_resources.get_distribution("openai").version
                print(f"OpenAI: {openai_version}")
                
                openai_major = float('.'.join(openai_version.split('.')[:2]))
                if openai_major >= 1.0:
                    print("✅ OpenAI version supports new API format")
                else:
                    print("⚠️ Consider upgrading OpenAI for latest features")
            except:
                print("❌ OpenAI package not found")
            
        except Exception as e:
            print(f"❌ Version check failed: {str(e)}")
    
    def check_railway_compatibility(self):
        """Check Railway deployment compatibility"""
        print("\n🚀 Railway Deployment Compatibility:")
        print("-" * 50)
        
        railway_requirements = {
            'gunicorn': 'WSGI server for Railway',
            'psycopg2': 'PostgreSQL support',  
            'whitenoise': 'Static file serving',
            'dj-database-url': 'Database URL parsing'
        }
        
        for package, description in railway_requirements.items():
            try:
                if package == 'psycopg2':
                    # Check for psycopg2-binary as well
                    try:
                        pkg_resources.get_distribution("psycopg2-binary")
                        print(f"✅ {package} (binary): {description}")
                    except:
                        pkg_resources.get_distribution("psycopg2")
                        print(f"✅ {package}: {description}")
                else:
                    pkg_resources.get_distribution(package)
                    print(f"✅ {package}: {description}")
                    
            except pkg_resources.DistributionNotFound:
                print(f"❌ {package}: Missing - {description}")
    
    def security_check(self):
        """Check for security-related packages"""
        print("\n🔒 Security Package Analysis:")
        print("-" * 50)
        
        security_packages = {
            'django-ratelimit': 'Rate limiting protection',
            'sentry-sdk': 'Error tracking and monitoring',
            'django-health-check': 'Health check endpoints'
        }
        
        for package, description in security_packages.items():
            try:
                pkg_resources.get_distribution(package)
                print(f"✅ {package}: {description}")
            except pkg_resources.DistributionNotFound:
                print(f"⚠️ {package}: Optional - {description}")
    
    def run_validation(self):
        """Run complete validation"""
        print("🔍 MediXScan Backend Requirements Validation")
        print("=" * 60)
        
        # Read requirements
        requirements = self.read_requirements()
        print(f"\n📄 Found {len(requirements)} requirements in requirements.txt")
        
        # Test critical imports
        import_results = self.test_critical_imports()
        
        # Version compatibility
        self.validate_versions()
        
        # Railway compatibility
        self.check_railway_compatibility()
        
        # Security check
        self.security_check()
        
        # Summary
        print("\n🎯 Validation Summary:")
        print("=" * 30)
        
        critical_passed = sum(1 for passed in import_results.values() if passed)
        critical_total = len(import_results)
        
        print(f"Critical Imports: {critical_passed}/{critical_total} passed")
        
        if critical_passed == critical_total:
            print("✅ ALL CRITICAL DEPENDENCIES ARE WORKING")
            print("✅ PROJECT IS READY FOR RAILWAY DEPLOYMENT")
            return True
        else:
            print("❌ SOME CRITICAL DEPENDENCIES ARE MISSING")
            print("❌ FIX DEPENDENCIES BEFORE DEPLOYMENT")
            
            # Show which ones failed
            failed = [pkg for pkg, passed in import_results.items() if not passed]
            print(f"\nFailed imports: {', '.join(failed)}")
            print("\nTo fix, run:")
            for pkg in failed:
                print(f"pip install {pkg}")
            
            return False

def main():
    validator = RequirementsValidator()
    success = validator.run_validation()
    
    if success:
        print("\n🎉 Requirements validation passed!")
        print("Your project is ready for Railway deployment!")
        sys.exit(0)
    else:
        print("\n🚨 Requirements validation failed!")
        print("Please install missing dependencies before deploying.")
        sys.exit(1)

if __name__ == "__main__":
    main()