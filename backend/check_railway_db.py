#!/usr/bin/env python3
"""
Railway PostgreSQL Database Connection Checker
Helps configure and test connection to Railway database
"""

import subprocess
import json
import os
import sys

def check_railway_cli():
    """Check if Railway CLI is installed and logged in"""
    try:
        result = subprocess.run(['railway', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ Railway CLI installed: {result.stdout.strip()}")
            return True
        else:
            print("❌ Railway CLI not found")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("❌ Railway CLI not installed or not in PATH")
        return False

def get_railway_vars():
    """Get Railway environment variables"""
    try:
        print("🔍 Fetching Railway environment variables...")
        result = subprocess.run(['railway', 'variables'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Railway variables retrieved")
            print("\n📋 Railway Environment Variables:")
            print(result.stdout)
            return result.stdout
        else:
            print(f"❌ Failed to get Railway variables: {result.stderr}")
            return None
    except Exception as e:
        print(f"❌ Error getting Railway variables: {e}")
        return None

def get_database_info():
    """Extract database connection info from Railway"""
    try:
        print("🔍 Getting Railway database connection info...")
        result = subprocess.run(['railway', 'connect', 'postgres', '--json'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            try:
                db_info = json.loads(result.stdout)
                print("✅ Database connection info retrieved")
                return db_info
            except json.JSONDecodeError:
                print("⚠️  Non-JSON response from railway connect")
                print(result.stdout)
                return None
        else:
            print(f"❌ Failed to get database info: {result.stderr}")
            return None
    except Exception as e:
        print(f"❌ Error getting database info: {e}")
        return None

def create_local_env():
    """Create local .env file with Railway database credentials"""
    print("🔧 Creating local .env file with Railway database...")
    
    # Get Railway variables to extract database URL
    vars_output = get_railway_vars()
    if not vars_output:
        print("❌ Could not get Railway variables")
        return False
    
    # Look for DATABASE_URL in the output
    database_url = None
    for line in vars_output.split('\n'):
        if 'DATABASE_URL' in line:
            # Extract the URL - format varies but usually has the URL after =
            parts = line.split('=', 1)
            if len(parts) > 1:
                database_url = parts[1].strip()
                break
    
    if not database_url:
        print("❌ DATABASE_URL not found in Railway variables")
        return False
    
    print(f"✅ Found DATABASE_URL: {database_url[:50]}...")
    
    # Create .env.railway file
    env_content = f"""# Railway PostgreSQL Database Configuration
# Generated automatically from Railway CLI

DATABASE_URL={database_url}

# Django Configuration
SECRET_KEY=django-insecure-local-development-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,medixscan-production.up.railway.app

# CORS Configuration (for React frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5175,http://127.0.0.1:3000,http://127.0.0.1:5175
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOW_CREDENTIALS=True

# OpenAI Configuration (add your key)
OPENAI_API_KEY=your-openai-api-key-here
"""
    
    try:
        with open('.env.railway', 'w') as f:
            f.write(env_content)
        print("✅ Created .env.railway file")
        
        # Also update main .env file
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Updated .env file with Railway database")
        return True
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def test_database_connection():
    """Test connection to Railway database"""
    print("🔍 Testing database connection...")
    
    try:
        import psycopg2
        from urllib.parse import urlparse
        
        # Read DATABASE_URL from environment or .env file
        database_url = os.getenv('DATABASE_URL')
        if not database_url and os.path.exists('.env'):
            with open('.env', 'r') as f:
                for line in f:
                    if line.startswith('DATABASE_URL='):
                        database_url = line.split('=', 1)[1].strip()
                        break
        
        if not database_url:
            print("❌ DATABASE_URL not found")
            return False
        
        # Parse the DATABASE_URL
        parsed = urlparse(database_url)
        
        conn_params = {
            'host': parsed.hostname,
            'port': parsed.port or 5432,
            'database': parsed.path[1:],  # Remove leading '/'
            'user': parsed.username,
            'password': parsed.password
        }
        
        print(f"🔗 Connecting to: {parsed.hostname}:{conn_params['port']}")
        print(f"📊 Database: {conn_params['database']}")
        print(f"👤 User: {conn_params['user']}")
        
        # Test connection
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        # Check tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        print("✅ Database connection successful!")
        print(f"📊 PostgreSQL Version: {version[0][:50]}...")
        print(f"📋 Tables found: {len(tables)}")
        if tables:
            print("   Tables:", [table[0] for table in tables[:5]])
            if len(tables) > 5:
                print(f"   ... and {len(tables) - 5} more")
        
        return True
        
    except ImportError:
        print("❌ psycopg2 not installed. Install with: pip install psycopg2-binary")
        return False
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    print("🚀 RAILWAY POSTGRESQL DATABASE CHECKER")
    print("=" * 50)
    
    # Check if we're in the backend directory
    if not os.path.exists('manage.py'):
        print("❌ Please run this script from the backend directory")
        return False
    
    # Check Railway CLI
    if not check_railway_cli():
        print("\n💡 To install Railway CLI:")
        print("   npm install -g @railway/cli")
        print("   railway login")
        return False
    
    print()
    
    # Get Railway variables
    get_railway_vars()
    print()
    
    # Create local env file
    if create_local_env():
        print()
        
        # Test database connection
        if test_database_connection():
            print("\n🎉 SUCCESS!")
            print("✅ Railway database is accessible")
            print("✅ Local environment configured") 
            print("✅ Ready to run Django with Railway database")
            print()
            print("🚀 Next steps:")
            print("   python manage.py migrate")
            print("   python manage.py runserver")
            return True
    
    print("\n❌ Setup incomplete. Check the errors above.")
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)