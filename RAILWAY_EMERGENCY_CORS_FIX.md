# 🚨 EMERGENCY RAILWAY ENVIRONMENT SETUP 
## IMMEDIATE CORS FIX for www.rugrel.in Login Issues

## 🔥 **URGENT: Add These Variables to Railway NOW**

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app/dashboard
2. Select: `medixscan-production` 
3. Go to: **Variables** tab
4. Add/Update these variables:

### Step 2: Critical Variables (Copy-Paste Exactly)

```env
CORS_ALLOW_ALL_ORIGINS=True
```

```env
CORS_ALLOWED_ORIGINS=https://www.rugrel.in,https://rugrel.in,https://medixscan.vercel.app,https://medixscan-rug.vercel.app,http://localhost:3000,http://localhost:5173,http://localhost:5175,http://localhost:5176,http://localhost:5177
```

```env
ALLOWED_HOSTS=*
```

```env
DEBUG=True
```

```env
SECURE_SSL_REDIRECT=False
```

### Step 3: Save and Wait
- Click "Save" after adding each variable
- Railway will automatically redeploy (takes 2-3 minutes)
- Wait for deployment to complete

### Step 4: Test Immediately
After Railway redeploys, test login at:
`https://www.rugrel.in/auth/sign-in`

## 🎯 **What This Does:**
- `CORS_ALLOW_ALL_ORIGINS=True` - Temporarily allows ALL domains (bypasses CORS blocking)
- `ALLOWED_HOSTS=*` - Accepts requests from any domain
- `DEBUG=True` - Shows detailed error messages
- `SECURE_SSL_REDIRECT=False` - Prevents SSL redirect issues

## ⚡ **Expected Result:**
- **CORS errors disappear** within 5 minutes
- **Login works** at www.rugrel.in
- **No more "Access-Control-Allow-Origin" errors**

## 🔧 **If Still Having Issues:**
1. Check Railway logs: Railway Dashboard → Deployments → View Logs
2. Ensure all 5 variables are set exactly as shown above
3. Wait 5 minutes for full deployment

**This is a temporary fix - we'll secure it properly once login is working!** 🚀