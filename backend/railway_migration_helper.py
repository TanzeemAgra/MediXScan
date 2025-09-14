#!/usr/bin/env python3
"""
PostgreSQL Database Migration Helper for Railway Deployment
Automates the process of migrating local PostgreSQL to Railway PostgreSQL
"""

import os
import sys
import subprocess
import json
from datetime import datetime
import psycopg2
from psycopg2 import sql
import argparse

class DatabaseMigrationHelper:
    def __init__(self):
        self.backup_dir = "database_backups"
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def create_backup_directory(self):
        """Create backup directory if it doesn't exist"""
        if not os.path.exists(self.backup_dir):
            os.makedirs(self.backup_dir)
            print(f"✅ Created backup directory: {self.backup_dir}")
        
    def backup_local_database(self):
        """Create comprehensive backup of local PostgreSQL database"""
        print("🔄 Creating local database backup...")
        
        # Get local database credentials from .env or user input
        db_name = os.getenv('DB_NAME', 'radiology')
        db_user = os.getenv('DB_USER', 'postgres')
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = os.getenv('DB_PORT', '5432')
        
        if not os.getenv('DB_PASSWORD'):
            print("❌ DB_PASSWORD not found in environment variables")
            print("Please set DB_PASSWORD in your .env file or export it:")
            print("set DB_PASSWORD=your_password")
            return False
        
        backup_files = {}
        
        try:
            # Full database backup
            full_backup = f"{self.backup_dir}/radiology_full_backup_{self.timestamp}.sql"
            cmd = [
                'pg_dump',
                '-U', db_user,
                '-h', db_host,
                '-p', db_port,
                '-d', db_name,
                '--no-owner',
                '--no-privileges',
                '--clean',
                '--if-exists',
                '--verbose'
            ]
            
            with open(full_backup, 'w') as f:
                result = subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE, 
                                      text=True, env=dict(os.environ, PGPASSWORD=os.getenv('DB_PASSWORD')))
            
            if result.returncode == 0:
                backup_files['full'] = full_backup
                print(f"✅ Full backup created: {full_backup}")
            else:
                print(f"❌ Full backup failed: {result.stderr}")
                return False
            
            # Data-only backup
            data_backup = f"{self.backup_dir}/radiology_data_only_{self.timestamp}.sql"
            cmd_data = cmd.copy()
            cmd_data.append('--data-only')
            
            with open(data_backup, 'w') as f:
                result = subprocess.run(cmd_data, stdout=f, stderr=subprocess.PIPE, 
                                      text=True, env=dict(os.environ, PGPASSWORD=os.getenv('DB_PASSWORD')))
            
            if result.returncode == 0:
                backup_files['data'] = data_backup
                print(f"✅ Data backup created: {data_backup}")
            
            # Schema-only backup
            schema_backup = f"{self.backup_dir}/radiology_schema_only_{self.timestamp}.sql"
            cmd_schema = cmd.copy()
            cmd_schema.append('--schema-only')
            
            with open(schema_backup, 'w') as f:
                result = subprocess.run(cmd_schema, stdout=f, stderr=subprocess.PIPE, 
                                      text=True, env=dict(os.environ, PGPASSWORD=os.getenv('DB_PASSWORD')))
            
            if result.returncode == 0:
                backup_files['schema'] = schema_backup
                print(f"✅ Schema backup created: {schema_backup}")
            
            # Create backup manifest
            manifest = {
                'timestamp': self.timestamp,
                'database_name': db_name,
                'backup_files': backup_files,
                'migration_status': 'backup_completed'
            }
            
            manifest_file = f"{self.backup_dir}/backup_manifest_{self.timestamp}.json"
            with open(manifest_file, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            print(f"✅ Backup manifest created: {manifest_file}")
            return True
            
        except Exception as e:
            print(f"❌ Backup failed: {str(e)}")
            return False
    
    def analyze_local_database(self):
        """Analyze local database structure and data"""
        print("🔍 Analyzing local database...")
        
        try:
            db_name = os.getenv('DB_NAME', 'radiology')
            db_user = os.getenv('DB_USER', 'postgres')
            db_host = os.getenv('DB_HOST', 'localhost')
            db_port = os.getenv('DB_PORT', '5432')
            db_password = os.getenv('DB_PASSWORD')
            
            conn = psycopg2.connect(
                host=db_host,
                database=db_name,
                user=db_user,
                password=db_password,
                port=db_port
            )
            
            cur = conn.cursor()
            
            # Get table information
            cur.execute("""
                SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
                FROM pg_stat_user_tables 
                ORDER BY schemaname, tablename;
            """)
            
            tables = cur.fetchall()
            
            print("📊 Database Analysis Results:")
            print("-" * 60)
            total_records = 0
            
            for table in tables:
                schema, table_name, inserts, updates, deletes = table
                
                # Get current row count
                cur.execute(sql.SQL("SELECT COUNT(*) FROM {}.{}").format(
                    sql.Identifier(schema), sql.Identifier(table_name)
                ))
                row_count = cur.fetchone()[0]
                total_records += row_count
                
                print(f"Table: {schema}.{table_name}")
                print(f"  Records: {row_count:,}")
                print(f"  Inserts: {inserts:,}, Updates: {updates:,}, Deletes: {deletes:,}")
                print()
            
            print(f"🎯 Total Records: {total_records:,}")
            
            # Get database size
            cur.execute("SELECT pg_size_pretty(pg_database_size(%s))", (db_name,))
            db_size = cur.fetchone()[0]
            print(f"💾 Database Size: {db_size}")
            
            cur.close()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"❌ Database analysis failed: {str(e)}")
            return False
    
    def generate_railway_commands(self):
        """Generate Railway deployment commands"""
        print("🚀 Generating Railway deployment commands...")
        
        commands = [
            "# Railway Deployment Commands - Copy and execute these step by step",
            "",
            "# 1. Install Railway CLI (if not already installed)",
            "npm install -g @railway/cli",
            "",
            "# 2. Login to Railway",
            "railway login",
            "",
            "# 3. Navigate to backend directory",
            "cd D:\\radiology_v2\\backend",
            "",
            "# 4. Initialize Railway project",
            "railway init",
            "",
            "# 5. Add PostgreSQL service",
            "railway add --database postgresql",
            "",
            "# 6. Set environment variables",
            "railway variables set SECRET_KEY=\"$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')\"",
            "railway variables set DEBUG=False",
            "railway variables set ENVIRONMENT=production",
            "railway variables set RAILWAY_ENVIRONMENT=production",
            "",
            "# 7. Set your OpenAI API Key (GENERATE A NEW ONE!)",
            "railway variables set OPENAI_API_KEY=\"your_new_openai_api_key_here\"",
            "",
            "# 8. Set CORS origins (replace with your Vercel domain)",
            "railway variables set CORS_ORIGINS=\"https://your-app.vercel.app,https://*.vercel.app\"",
            "",
            "# 9. Set allowed hosts",
            "railway variables set ALLOWED_HOSTS=\"*.railway.app,*.up.railway.app,your-app.vercel.app\"",
            "",
            "# 10. Deploy to Railway",
            "railway up",
            "",
            "# 11. Run migrations on Railway",
            "railway run python manage.py migrate",
            "",
            "# 12. Create superuser on Railway",
            "railway run python manage.py createsuperuser",
            "",
            "# 13. Load data from backup (choose one method):",
            "",
            "# Method A: Using Django fixtures (recommended for small datasets)",
            "# First create fixture from local database:",
            "python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission > local_data_fixture.json",
            "# Then load on Railway:",
            "railway run python manage.py loaddata local_data_fixture.json",
            "",
            "# Method B: Direct SQL import (recommended for large datasets)",
            "# Get Railway database credentials first:",
            "railway variables | findstr PG",
            "# Then import using psql (replace credentials):",
            f"# psql \"postgresql://postgres:RAILWAY_PASSWORD@RAILWAY_HOST:RAILWAY_PORT/railway\" < {self.backup_dir}/radiology_full_backup_{self.timestamp}.sql",
            "",
            "# 14. Verify deployment",
            "railway domain  # Get your app URL",
            "railway logs --tail  # Monitor logs",
            "",
            "# 15. Test the deployed application",
            "# Visit the Railway URL and test functionality",
        ]
        
        commands_file = f"{self.backup_dir}/railway_deployment_commands_{self.timestamp}.txt"
        with open(commands_file, 'w') as f:
            f.write('\n'.join(commands))
        
        print(f"✅ Railway commands saved: {commands_file}")
        
        # Display commands
        print("\n" + "="*60)
        print("RAILWAY DEPLOYMENT COMMANDS")
        print("="*60)
        for cmd in commands[:20]:  # Show first 20 lines
            print(cmd)
        print("... (see full commands in the generated file)")
        
        return commands_file
    
    def check_prerequisites(self):
        """Check if all prerequisites are met"""
        print("🔍 Checking prerequisites...")
        
        checks = {
            'PostgreSQL (pg_dump)': self.check_pg_dump(),
            'Railway CLI': self.check_railway_cli(),
            'Environment Variables': self.check_env_vars(),
            'Backup Directory': True  # Always create if needed
        }
        
        all_passed = all(checks.values())
        
        for check, status in checks.items():
            status_icon = "✅" if status else "❌"
            print(f"{status_icon} {check}")
        
        if not all_passed:
            print("\n❌ Some prerequisites are missing. Please install them before proceeding.")
            return False
        
        print("\n✅ All prerequisites met!")
        return True
    
    def check_pg_dump(self):
        """Check if pg_dump is available"""
        try:
            result = subprocess.run(['pg_dump', '--version'], capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False
    
    def check_railway_cli(self):
        """Check if Railway CLI is installed"""
        try:
            result = subprocess.run(['railway', '--version'], capture_output=True, text=True)
            return result.returncode == 0
        except FileNotFoundError:
            return False
    
    def check_env_vars(self):
        """Check if required environment variables are set"""
        required_vars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD']
        return all(os.getenv(var) for var in required_vars)

def main():
    parser = argparse.ArgumentParser(description='PostgreSQL to Railway Migration Helper')
    parser.add_argument('--backup', action='store_true', help='Create database backup')
    parser.add_argument('--analyze', action='store_true', help='Analyze local database')
    parser.add_argument('--commands', action='store_true', help='Generate Railway commands')
    parser.add_argument('--all', action='store_true', help='Run all operations')
    
    args = parser.parse_args()
    
    migrator = DatabaseMigrationHelper()
    
    print("🚀 MediXScan Database Migration Helper")
    print("="*50)
    
    # Check prerequisites
    if not migrator.check_prerequisites():
        sys.exit(1)
    
    migrator.create_backup_directory()
    
    if args.all or args.analyze:
        migrator.analyze_local_database()
    
    if args.all or args.backup:
        if not migrator.backup_local_database():
            sys.exit(1)
    
    if args.all or args.commands:
        migrator.generate_railway_commands()
    
    print("\n🎯 Migration Helper Complete!")
    print("Next steps:")
    print("1. Review the generated backup files")
    print("2. Follow the Railway deployment commands")
    print("3. Test the deployed application")
    print("4. Update frontend API URLs to point to Railway")

if __name__ == "__main__":
    main()