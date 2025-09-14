# 🎯 RAILWAY QUICK SETUP CHECKLIST

## 🔐 Your Generated SECRET_KEY
```
i!!3y0e0um@6j7ikhb+7k6xk4yeas3pe^5wpsn8tqpu0uw@rj9
```
**Copy this exact value to Railway as your SECRET_KEY variable**

---

## ✅ RAILWAY DASHBOARD STEPS

### 1. Go to Railway Dashboard
- Visit: https://railway.app
- Click on your **`medixscan-production`** project
- Click on your **Django backend service**
- Click **"Variables"** tab

### 2. Add These Variables (Copy & Paste Each One):

#### Essential Variables:
```
Variable Name: DEBUG
Value: False
```

```
Variable Name: SECRET_KEY
Value: i!!3y0e0um@6j7ikhb+7k6xk4yeas3pe^5wpsn8tqpu0uw@rj9
```

```
Variable Name: ALLOWED_HOSTS
Value: medixscan-production.up.railway.app,.up.railway.app,.railway.app
```

```
Variable Name: OPENAI_API_KEY
Value: [YOUR_OPENAI_API_KEY_HERE]
```

#### Security Variables:
```
Variable Name: SECURE_SSL_REDIRECT
Value: True
```

```
Variable Name: SECURE_HSTS_SECONDS
Value: 31536000
```

```
Variable Name: SECURE_HSTS_INCLUDE_SUBDOMAINS
Value: True
```

```
Variable Name: SESSION_COOKIE_SECURE
Value: True
```

```
Variable Name: CSRF_COOKIE_SECURE
Value: True
```

#### CORS Configuration:
```
Variable Name: CORS_ORIGINS
Value: https://your-vercel-app.vercel.app
```
*(Update with your actual Vercel domain later)*

---

## 🚀 AFTER SETTING VARIABLES

### Deploy Your Backend:
```bash
cd d:\radiology_v2\backend
railway up
```

### Run Initial Setup:
```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput
```

---

## 🔍 VERIFY DEPLOYMENT

After deployment, test these URLs:

- ✅ **Health Check**: https://medixscan-production.up.railway.app/health/
- ✅ **Admin Panel**: https://medixscan-production.up.railway.app/admin/
- ✅ **API Root**: https://medixscan-production.up.railway.app/api/

---

## ⚠️ IMPORTANT NOTES

1. **Replace `[YOUR_OPENAI_API_KEY_HERE]`** with your actual OpenAI API key
2. **Update `CORS_ORIGINS`** with your actual Vercel domain after frontend deployment
3. **Keep your SECRET_KEY secure** - never share it publicly
4. **DATABASE_URL** will be automatically set by Railway PostgreSQL

Your backend will be production-ready once these variables are set! 🎉