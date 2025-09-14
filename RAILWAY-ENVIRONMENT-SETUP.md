# 🚀 RAILWAY ENVIRONMENT VARIABLES SETUP GUIDE

## 📋 Step-by-Step Railway Dashboard Configuration

### 1. Access Railway Dashboard
1. Go to [https://railway.app](https://railway.app)
2. Sign in to your account
3. Navigate to your **`medixscan-production`** project

### 2. Navigate to Variables Section
1. Click on your **Backend Service** (Django app)
2. Click on **"Variables"** tab
3. Click **"+ New Variable"** for each environment variable below

---

## 🔧 REQUIRED ENVIRONMENT VARIABLES

### Core Django Configuration
```bash
# Set DEBUG to False for production
DEBUG=False

# Generate a new secure secret key (use the generator below)
SECRET_KEY=your_new_secure_secret_key_50_chars_long

# Railway will auto-set DATABASE_URL, but you can also set these
ENVIRONMENT=production
```

### Security Configuration
```bash
# Your Railway domain and security hosts
ALLOWED_HOSTS=medixscan-production.up.railway.app,.up.railway.app,.railway.app,localhost

# CORS origins (replace with your actual Vercel domain when deployed)
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://*.vercel.app

# Security settings for production
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### OpenAI Configuration
```bash
# Your OpenAI API key for medical analysis
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
```

### Email Configuration (Optional)
```bash
# Email settings for notifications
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### AWS S3 Configuration (Optional)
```bash
# Only if you plan to use S3 for file storage
USE_S3=False
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1
```

---

## 🔐 SECURE SECRET KEY GENERATOR

**IMPORTANT**: Never use your development secret key in production!

### Option 1: Generate in Railway Terminal
1. In Railway dashboard, go to your service
2. Click **"Deploy Logs"** → **"Terminal"** 
3. Run this command:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Option 2: Generate Locally (Recommended)
Run this in your local terminal:

```bash
cd d:\radiology_v2\backend
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the generated key and use it as your `SECRET_KEY` value.

---

## 📝 RAILWAY VARIABLE SETUP CHECKLIST

Copy and paste each variable exactly as shown:

### ✅ Essential Variables (Required)
- [ ] `DEBUG=False`
- [ ] `SECRET_KEY=your_generated_secret_key_here`
- [ ] `ALLOWED_HOSTS=medixscan-production.up.railway.app,.up.railway.app,.railway.app`
- [ ] `OPENAI_API_KEY=sk-your-openai-api-key-here`

### ✅ Security Variables (Recommended)
- [ ] `SECURE_SSL_REDIRECT=True`
- [ ] `SECURE_HSTS_SECONDS=31536000`
- [ ] `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
- [ ] `SECURE_HSTS_PRELOAD=True`
- [ ] `SESSION_COOKIE_SECURE=True`
- [ ] `CSRF_COOKIE_SECURE=True`

### ✅ CORS Variables (For Frontend)
- [ ] `CORS_ORIGINS=https://your-vercel-app.vercel.app`

---

## 🚀 DEPLOYMENT COMMANDS

After setting up environment variables, deploy your application:

```bash
# In your local terminal
cd d:\radiology_v2\backend

# Link to Railway (if not already linked)
railway link

# Deploy to Railway
railway up

# Run database migrations
railway run python manage.py migrate

# Create superuser account
railway run python manage.py createsuperuser

# Collect static files
railway run python manage.py collectstatic --noinput
```

---

## 🔍 VERIFICATION STEPS

After deployment, verify your setup:

### 1. Check Health Endpoint
Visit: `https://medixscan-production.up.railway.app/health/`

### 2. Check Admin Panel
Visit: `https://medixscan-production.up.railway.app/admin/`

### 3. Check API Root
Visit: `https://medixscan-production.up.railway.app/api/`

### 4. Test API Endpoints
```bash
# Test authentication endpoint
curl https://medixscan-production.up.railway.app/api/auth/

# Test patient management (if authenticated)
curl https://medixscan-production.up.railway.app/api/patient-management/
```

---

## ⚠️ IMPORTANT SECURITY NOTES

1. **Never commit real API keys** to your repository
2. **Use different OpenAI API keys** for development and production
3. **Generate a new SECRET_KEY** for production (don't use development key)
4. **Update CORS_ORIGINS** with your actual Vercel domain after frontend deployment
5. **Keep your Railway environment variables secure**

---

## 🎯 NEXT STEPS

1. ✅ **Set up all environment variables** in Railway dashboard
2. ⏳ **Deploy backend** using `railway up`
3. ⏳ **Run migrations** and create superuser
4. ⏳ **Test all endpoints** work correctly
5. ⏳ **Update Vercel frontend** with Railway API URLs
6. ⏳ **Test full application** functionality

Your Railway backend will be production-ready once these variables are configured! 🚀