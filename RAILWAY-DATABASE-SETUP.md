# Railway Database Setup Guide

## Step 1: Get PostgreSQL Connection Details

1. **Go to Railway Dashboard** → Your Project → PostgreSQL Database
2. **Click on "Variables" tab** in the database service
3. **Copy these connection details:**
   - `DATABASE_URL` (complete connection string)
   - `PGHOST` (hostname)
   - `PGPORT` (port, usually 5432)
   - `PGDATABASE` (database name)
   - `PGUSER` (username)
   - `PGPASSWORD` (password)

## Step 2: Configure Backend Service Environment Variables

1. **Go to your Backend Service** (not the database)
2. **Click "Variables" tab**
3. **Add these environment variables:**

```
DATABASE_URL = [Copy from PostgreSQL service]
DEBUG = False
SECRET_KEY = [Generate a new secret key]
ALLOWED_HOSTS = medixscan-production.up.railway.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS = https://your-frontend-domain.vercel.app
RAILWAY_ENVIRONMENT = production
```

### Generate Secret Key:
You can generate a Django secret key using:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

## Step 3: Run Database Migrations

1. **Go to Backend Service** → **Console/Terminal tab**
2. **Run these commands one by one:**

```bash
# Create database tables
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

## Step 4: Verify Database Connection

1. **Check if tables were created:**
```bash
python manage.py showmigrations
```

2. **Test database connection:**
```bash
python manage.py check --database default
```

## Step 5: Access Admin Panel

After completing migrations and creating superuser:
1. Visit: `https://medixscan-production.up.railway.app/admin/`
2. Login with your superuser credentials
3. Verify you can see Django admin interface

## Environment Variables Summary

Your backend service needs these variables:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Railway PostgreSQL Variables |
| `SECRET_KEY` | Django secret key | Generate new one |
| `DEBUG` | `False` | Set for production |
| `ALLOWED_HOSTS` | Your Railway domain | Backend security |
| `CORS_ALLOWED_ORIGINS` | Frontend domain | CORS configuration |

## Next Steps After Database Setup

1. ✅ Database migrations complete
2. ✅ Superuser created
3. ✅ Admin panel accessible
4. 🔄 Deploy frontend to Vercel
5. 🔄 Test full application workflow

## Troubleshooting

If you encounter issues:
- Check Railway logs in the backend service
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is copied exactly from PostgreSQL service
- Check that PostgreSQL and backend services are in the same project