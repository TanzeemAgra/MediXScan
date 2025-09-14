"""
Railway Environment Variables Generator
Run this script to generate the necessary environment variables for Railway deployment
"""

from django.core.management.utils import get_random_secret_key
import os

def generate_railway_env_vars():
    """Generate environment variables for Railway deployment"""
    
    print("🚀 Railway Environment Variables Generator")
    print("=" * 50)
    
    # Generate Django secret key
    secret_key = get_random_secret_key()
    
    print("\n📋 Copy these environment variables to your Railway Backend Service:")
    print("\n" + "=" * 50)
    
    print(f"SECRET_KEY = {secret_key}")
    print("DEBUG = False")
    print("ALLOWED_HOSTS = medixscan-production.up.railway.app,localhost,127.0.0.1")
    print("RAILWAY_ENVIRONMENT = production")
    
    print("\n⚠️  IMPORTANT: You also need to add:")
    print("DATABASE_URL = [Copy from your Railway PostgreSQL service Variables tab]")
    print("CORS_ALLOWED_ORIGINS = https://your-frontend-domain.vercel.app")
    
    print("\n" + "=" * 50)
    print("\n📝 Steps:")
    print("1. Go to Railway Dashboard → Your Backend Service → Variables")
    print("2. Add each variable above")
    print("3. Copy DATABASE_URL from PostgreSQL service")
    print("4. Save and redeploy")
    
    print("\n🔧 After setting variables, run in Railway Console:")
    print("python manage.py migrate")
    print("python manage.py createsuperuser")
    print("python manage.py collectstatic --noinput")
    
if __name__ == "__main__":
    generate_railway_env_vars()