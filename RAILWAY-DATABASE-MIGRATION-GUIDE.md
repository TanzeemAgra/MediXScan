# 🚀 COMPLETE RAILWAY DEPLOYMENT & DATABASE MIGRATION GUIDE

## 📊 DATABASE MIGRATION STRATEGY: Local PostgreSQL → Railway PostgreSQL

### PHASE 1: Pre-Migration Assessment

#### Step 1: Backup Current Local Database
```bash
# Navigate to your project directory
cd D:\radiology_v2\backend

# Create backup directory
mkdir database_backups
cd database_backups

# Create complete database dump (CRITICAL - DO THIS FIRST!)
pg_dump -U postgres -h localhost -p 5432 -d radiology --no-owner --no-privileges --clean --if-exists > radiology_backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Alternative with data only (if you want to recreate schema on Railway)
pg_dump -U postgres -h localhost -p 5432 -d radiology --data-only --no-owner --no-privileges > radiology_data_only_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Create schema only backup (for reference)
pg_dump -U postgres -h localhost -p 5432 -d radiology --schema-only --no-owner --no-privileges > radiology_schema_only_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

#### Step 2: Document Current Database State
```bash
# Check database size and tables
python manage.py dbshell
\dt
\du
\l
SELECT schemaname,tablename,attname,typename,char_maximum_length FROM pg_catalog.pg_attribute a INNER JOIN pg_catalog.pg_class c ON a.attrelid = c.oid INNER JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid INNER JOIN information_schema.columns col ON col.table_name = c.relname LEFT JOIN pg_catalog.pg_type t ON a.atttypid = t.oid WHERE a.attnum > 0 AND NOT a.attisdropped AND n.nspname NOT IN ('information_schema','pg_catalog') ORDER BY schemaname,tablename,attname;
\q
```

### PHASE 2: Railway Setup & Configuration

#### Step 1: Install Railway CLI
```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Verify installation
railway --version
```

#### Step 2: Railway Project Initialization
```bash
# Login to Railway (will open browser)
railway login

# Initialize Railway project in your backend directory
cd D:\radiology_v2\backend
railway init

# Link to existing project (if you already created one on Railway dashboard)
# railway link [project-id]
```

#### Step 3: Add PostgreSQL Service to Railway
```bash
# Add PostgreSQL database service
railway add --database postgresql

# OR if you prefer using the dashboard:
# 1. Go to Railway dashboard
# 2. Click "New Project"
# 3. Select "Add Service"  
# 4. Choose "PostgreSQL"
```

#### Step 4: Configure Railway Environment Variables
```bash
# Set Django configuration
railway variables set SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
railway variables set DEBUG=False
railway variables set ENVIRONMENT=production
railway variables set RAILWAY_ENVIRONMENT=production

# Set your OpenAI API key (generate a new one!)
railway variables set OPENAI_API_KEY="your_new_openai_api_key_here"

# Set CORS origins (replace with your Vercel domain)
railway variables set CORS_ORIGINS="https://your-app.vercel.app,https://*.vercel.app"

# Set allowed hosts (Railway will auto-configure database vars)
railway variables set ALLOWED_HOSTS="*.railway.app,*.up.railway.app,your-app.vercel.app"
```

### PHASE 3: Database Migration Execution

#### Step 1: Get Railway Database Credentials
```bash
# View all environment variables (including auto-generated DB credentials)
railway variables

# The important ones for database connection:
# PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT
```

#### Step 2: Test Railway Database Connection
```bash
# Test connection to Railway PostgreSQL
railway connect postgres

# OR manually connect using displayed credentials:
# psql postgresql://postgres:PASSWORD@HOST:PORT/railway
```

#### Step 3: Deploy Django Application to Railway
```bash
# Create or update Procfile for Railway
echo "web: python manage.py migrate && python manage.py collectstatic --noinput && gunicorn medixscan_project.wsgi --log-file -" > Procfile

# Create or update runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy to Railway
railway up

# Monitor deployment
railway logs
```

#### Step 4: Run Django Migrations on Railway
```bash
# Connect to Railway and run migrations
railway run python manage.py migrate

# Create superuser on Railway database
railway run python manage.py createsuperuser

# Collect static files
railway run python manage.py collectstatic --noinput
```

#### Step 5: Migrate Data from Local to Railway

**Option A: Using Django Fixtures (Recommended for small datasets)**
```bash
# 1. Export data from local database
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission > local_data_fixture.json

# 2. Upload fixture to Railway and load
railway run python manage.py loaddata local_data_fixture.json
```

**Option B: Direct SQL Import (Recommended for large datasets)**
```bash
# 1. Get Railway database connection details
railway variables | findstr PG

# 2. Modify your backup SQL file to be compatible
# Edit the backup file to remove any owner/privilege statements

# 3. Import to Railway PostgreSQL
# Method 1: Using Railway CLI
railway connect postgres < radiology_backup_YYYYMMDD_HHMMSS.sql

# Method 2: Using psql directly
psql "postgresql://postgres:RAILWAY_PASSWORD@RAILWAY_HOST:RAILWAY_PORT/railway" < radiology_backup_YYYYMMDD_HHMMSS.sql
```

**Option C: Using pg_restore (if you have custom format backup)**
```bash
# Create custom format backup first
pg_dump -U postgres -h localhost -p 5432 -d radiology -Fc --no-owner --no-privileges > radiology_backup.dump

# Restore to Railway
pg_restore -h RAILWAY_HOST -p RAILWAY_PORT -U postgres -d railway --no-owner --no-privileges radiology_backup.dump
```

### PHASE 4: Data Validation & Testing

#### Step 1: Verify Data Migration
```bash
# Connect to Railway database
railway run python manage.py dbshell

# Check tables and row counts
\dt
SELECT 'accounts_user' as table_name, COUNT(*) as row_count FROM accounts_user
UNION ALL
SELECT 'patient_management_patient', COUNT(*) FROM patient_management_patient
UNION ALL  
SELECT 'reports_report', COUNT(*) FROM reports_report;

# Compare with local database counts
\q
```

#### Step 2: Test Django Application
```bash
# Run Django checks
railway run python manage.py check

# Test admin access
railway run python manage.py createsuperuser --username admin --email admin@medixscan.com

# Get Railway app URL
railway domain
```

#### Step 3: Test API Endpoints
```bash
# Test authentication endpoint
curl -X POST https://your-railway-app.up.railway.app/api/auth/login/ -H "Content-Type: application/json" -d '{"username":"admin","password":"your_password"}'

# Test patient list endpoint
curl -H "Authorization: Token your_token" https://your-railway-app.up.railway.app/api/patients/
```

### PHASE 5: Update Django Settings for Railway

Update your `backend/medixscan_project/settings.py` to use the configuration management:

```python
# Add this to the top of settings.py
import sys
sys.path.append(os.path.join(BASE_DIR))

try:
    from config_management import (
        DATABASE_CONFIG, SECURITY_CONFIG, CORS_CONFIG, 
        EMAIL_CONFIG, AWS_CONFIG, LOGGING_CONFIG
    )
    
    # Use soft-coded configuration
    DATABASES = {'default': DATABASE_CONFIG}
    
    SECRET_KEY = SECURITY_CONFIG['SECRET_KEY']
    DEBUG = SECURITY_CONFIG['DEBUG']
    ALLOWED_HOSTS = SECURITY_CONFIG['ALLOWED_HOSTS']
    
    # CORS Configuration
    CORS_ALLOWED_ORIGINS = CORS_CONFIG['CORS_ALLOWED_ORIGINS']
    CORS_ALLOW_CREDENTIALS = CORS_CONFIG['CORS_ALLOW_CREDENTIALS']
    
    # Security settings for production
    if not DEBUG:
        SECURE_SSL_REDIRECT = SECURITY_CONFIG['SECURE_SSL_REDIRECT']
        SECURE_HSTS_SECONDS = SECURITY_CONFIG['SECURE_HSTS_SECONDS']
        SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURITY_CONFIG['SECURE_HSTS_INCLUDE_SUBDOMAINS']
        SECURE_HSTS_PRELOAD = SECURITY_CONFIG['SECURE_HSTS_PRELOAD']
        SESSION_COOKIE_SECURE = SECURITY_CONFIG['SESSION_COOKIE_SECURE']
        CSRF_COOKIE_SECURE = SECURITY_CONFIG['CSRF_COOKIE_SECURE']
        
        # Static files configuration for production
        STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    
except ImportError:
    # Fallback to environment variables if config_management is not available
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('PGDATABASE', os.getenv('DB_NAME', 'medixscan_db')),
            'USER': os.getenv('PGUSER', os.getenv('DB_USER', 'postgres')),
            'PASSWORD': os.getenv('PGPASSWORD', os.getenv('DB_PASSWORD')),
            'HOST': os.getenv('PGHOST', os.getenv('DB_HOST', 'localhost')),
            'PORT': os.getenv('PGPORT', os.getenv('DB_PORT', '5432')),
            'OPTIONS': {
                'sslmode': 'require' if os.getenv('RAILWAY_ENVIRONMENT') else 'prefer',
            },
        }
    }
```

### PHASE 6: Troubleshooting Common Issues

#### Issue 1: SSL Certificate Verification Failed
```bash
# Add to Railway environment variables
railway variables set DB_SSLMODE=require
railway variables set PGSSLMODE=require
```

#### Issue 2: Migration Conflicts
```bash
# Reset migrations if needed (CAUTION: Only for development)
railway run python manage.py migrate --fake-initial

# OR create new migration
railway run python manage.py makemigrations
railway run python manage.py migrate
```

#### Issue 3: Static Files Not Loading
```bash
# Ensure WhiteNoise is installed
pip install whitenoise

# Update requirements.txt
pip freeze > requirements.txt

# Redeploy
railway up
```

#### Issue 4: Memory/Performance Issues
```bash
# Check Railway service metrics
railway status

# Scale up if needed (Railway dashboard)
# Or optimize queries in your Django code
```

### 🔄 ROLLBACK STRATEGY (If Something Goes Wrong)

#### Immediate Rollback to Local Database
```bash
# 1. Stop Railway deployment
railway down

# 2. Restore local database if needed
psql -U postgres -h localhost -p 5432 -d radiology < radiology_backup_YYYYMMDD_HHMMSS.sql

# 3. Update frontend API URL back to localhost
# Edit frontend/.env: VITE_API_BASE_URL=http://localhost:8000/api
```

#### Partial Rollback (Keep Railway, Restore Data)
```bash
# 1. Drop Railway database tables
railway run python manage.py flush --no-input

# 2. Re-run migrations
railway run python manage.py migrate

# 3. Restore from backup
railway connect postgres < radiology_backup_YYYYMMDD_HHMMSS.sql
```

### ✅ POST-MIGRATION CHECKLIST

- [ ] Local database backed up successfully
- [ ] Railway PostgreSQL service created
- [ ] Environment variables configured on Railway
- [ ] Django application deployed to Railway
- [ ] Database migrations completed
- [ ] Data successfully migrated and validated
- [ ] API endpoints accessible from Railway URL
- [ ] Admin panel functional
- [ ] Patient management features working
- [ ] Authentication system working
- [ ] Static files serving correctly
- [ ] SSL/HTTPS enabled
- [ ] Error handling working properly

### 📞 SUPPORT & MONITORING

#### Railway Monitoring
```bash
# Check logs
railway logs --tail

# Check status
railway status

# Check environment variables
railway variables
```

#### Database Monitoring
```bash
# Connect to Railway database
railway connect postgres

# Check database performance
SELECT * FROM pg_stat_activity;
SELECT schemaname,tablename,n_tup_ins,n_tup_upd,n_tup_del FROM pg_stat_user_tables;
```

## 🎯 ESTIMATED TIMELINE

- **Phase 1 (Backup)**: 30 minutes
- **Phase 2 (Railway Setup)**: 45 minutes  
- **Phase 3 (Migration)**: 1-3 hours (depending on data size)
- **Phase 4 (Testing)**: 1 hour
- **Phase 5 (Settings Update)**: 30 minutes
- **Phase 6 (Troubleshooting)**: As needed

**Total Estimated Time**: 3-6 hours for complete migration

This comprehensive guide ensures your PostgreSQL database migration from local to Railway is smooth, secure, and reversible!