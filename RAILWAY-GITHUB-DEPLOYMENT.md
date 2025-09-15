# 🚀 RAILWAY GITHUB DEPLOYMENT GUIDE

## Step 1: Access Railway Dashboard
1. **Open:** https://railway.app/dashboard
2. **Login:** Make sure you're logged in as xerxez.in@gmail.com

## Step 2: Create New Project
1. **Click:** "New Project" button
2. **Select:** "Deploy from GitHub repo"
3. **Choose:** "TanzeemAgra/MediXScan" from your repositories
4. **Branch:** main

## Step 3: Configure Service Settings
When prompted, configure these settings:

### Service Configuration:
```
Service Name: MediXScan-Backend
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn medixscan_project.wsgi:application --bind 0.0.0.0:$PORT
```

### Environment Variables (Add These):
```
DEBUG=False
SECRET_KEY=i!!3y0e0um@6j7ikhb+7k6xk4yeas3pe^5wpsn8tqpu0uw@rj9
ALLOWED_HOSTS=*.up.railway.app,*.railway.app
DJANGO_SETTINGS_MODULE=medixscan_project.settings
```

## Step 4: Add PostgreSQL Database
1. **In Railway dashboard:** Click "New" → "Database" → "Add PostgreSQL"
2. **Database will be automatically connected** to your service

## Step 5: Update Environment Variables
After database is added, Railway will auto-populate:
```
DATABASE_URL=postgresql://... (Auto-generated)
PGHOST=... (Auto-generated)
PGPORT=... (Auto-generated)
PGDATABASE=... (Auto-generated)
PGUSER=... (Auto-generated)
PGPASSWORD=... (Auto-generated)
```

## Step 6: Deploy
1. **Railway will automatically deploy** when you connect the GitHub repo
2. **Monitor deployment** in the Railway dashboard
3. **Check logs** in real-time

## Step 7: Post-Deployment Setup
Once deployed, run these commands in Railway's built-in terminal:

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

## Step 8: Get Your Domain
Railway will provide a domain like:
```
https://your-service-name.up.railway.app
```

## Expected Results:
✅ Backend deployed and running
✅ PostgreSQL database connected
✅ Environment variables configured
✅ Django admin accessible
✅ API endpoints working

---

## 🎯 Advantages of GitHub Integration:
- ✅ **Better logging:** Full visibility in dashboard
- ✅ **Auto-deployment:** Updates when you push to GitHub
- ✅ **Environment detection:** Railway auto-detects Django
- ✅ **Easier debugging:** Clear error messages
- ✅ **Branch selection:** Can deploy from different branches

---

## 🚀 Ready to Deploy?

1. **Click this link:** https://railway.app/dashboard
2. **Follow the steps above**
3. **Let me know when deployment starts** - I'll help with configuration!

This method is much more reliable than CLI deployment! 🎉