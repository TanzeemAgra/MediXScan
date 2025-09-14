# 🔧 RAILWAY ENVIRONMENT VARIABLES - COPY & PASTE READY

## Essential Variables (Add these in Railway Dashboard)

### Django Core Configuration
```
DEBUG=False
SECRET_KEY=i!!3y0e0um@6j7ikhb+7k6xk4yeas3pe^5wpsn8tqpu0uw@rj9
DJANGO_SETTINGS_MODULE=medixscan_project.settings
```

### Security & Hosts
```
ALLOWED_HOSTS=*.up.railway.app,*.railway.app,localhost
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### OpenAI Configuration (Replace with your key)
```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
```

### CORS Configuration (Update with your Vercel domain later)
```
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

---

## 📝 HOW TO ADD THESE IN RAILWAY:

1. **After deployment starts**, go to your service
2. **Click "Variables" tab**
3. **Click "Add Variable"** for each one above
4. **Copy exact name and value** from above

---

## 🔄 WHAT HAPPENS NEXT:

1. **Railway will detect:** Python/Django project
2. **Railway will install:** Dependencies from requirements.txt  
3. **Railway will use:** Your Procfile for startup commands
4. **You'll get:** A domain like `https://medixscan-production.up.railway.app`

---

## ⚡ POST-DEPLOYMENT COMMANDS:

After successful deployment, run these in Railway terminal:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```