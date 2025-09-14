# 🚀 RAILWAY DEVELOPER DEPLOYMENT COMMANDS

## Step-by-Step Deployment After Upgrade

### 1. Deploy Your Backend
```bash
cd d:\radiology_v2\backend
railway up
```

### 2. Add PostgreSQL Database
```bash
railway add postgresql
```

### 3. Set Environment Variables
Go to Railway dashboard → Your Service → Variables tab, add:

```
DEBUG=False
SECRET_KEY=i!!3y0e0um@6j7ikhb+7k6xk4yeas3pe^5wpsn8tqpu0uw@rj9
ALLOWED_HOSTS=medixscan-production.up.railway.app,.up.railway.app,.railway.app
OPENAI_API_KEY=your_openai_api_key_here
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 4. Run Database Migrations
```bash
railway run python manage.py migrate
```

### 5. Create Superuser
```bash
railway run python manage.py createsuperuser
```

### 6. Collect Static Files
```bash
railway run python manage.py collectstatic --noinput
```

### 7. Verify Deployment
- Visit: https://medixscan-production.up.railway.app/
- Visit: https://medixscan-production.up.railway.app/admin/
- Visit: https://medixscan-production.up.railway.app/api/

## Expected Results:
✅ Backend running on Railway
✅ PostgreSQL database connected
✅ SSL certificates active
✅ Admin panel accessible
✅ API endpoints working