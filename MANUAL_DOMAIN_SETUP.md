# Manual Custom Domain Setup for www.rugrel.in
## Step-by-Step Web Interface Guide

## 🎯 **OPTION 1: Frontend Only (Recommended Start)**

### Step 1: Add Domain in Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Open: https://vercel.com/dashboard
   - Login with your account

2. **Select Your Project**
   - Find and click on your `medixscan` project
   - (The one currently at medixscan.vercel.app)

3. **Navigate to Domains**
   - Click on "Settings" tab
   - Click on "Domains" in the left sidebar

4. **Add Your Custom Domain**
   - Click the "Add" button
   - Enter: `www.rugrel.in`
   - Click "Add"
   - Also add: `rugrel.in` (for root domain redirect)

5. **Vercel Will Show DNS Instructions**
   - Vercel will display the exact DNS records you need
   - Keep this page open for reference

### Step 2: Configure DNS Records (In Your Domain Provider)

**Log into your domain registrar/DNS provider where you manage rugrel.in:**

#### Add these DNS records:

**For www.rugrel.in:**
```
Type: CNAME
Name: www
Target/Value: cname.vercel-dns.com
TTL: 3600 (or Auto/Default)
```

**For rugrel.in (root domain):**
```
Type: A
Name: @ (or leave blank/root)
Target/Value: 76.76.19.19
TTL: 3600

Type: AAAA
Name: @ (or leave blank/root)  
Target/Value: 2606:4700:90:0:76:76:19:19
TTL: 3600
```

### Step 3: Verify Configuration

1. **In Vercel Dashboard**
   - Go back to your project → Settings → Domains
   - You should see your domains with status indicators
   - Wait for "Valid Configuration" status (5-60 minutes)

2. **Test Your Domain**
   - After DNS propagates, visit: https://www.rugrel.in
   - Should show your MediXScan application

---

## 🚀 **OPTION 2: Frontend + Backend Custom Domains**

### Frontend: www.rugrel.in + Backend: api.rugrel.in

#### Step A: Frontend Setup (Same as Option 1)
Follow Step 1 and 2 above for `www.rugrel.in`

#### Step B: Backend API Domain Setup

1. **Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - Login to your account
   - Click on your `medixscan-production` project

2. **Add Custom Domain**
   - Go to "Settings" tab
   - Click "Domains" in sidebar
   - Click "Custom Domain" button
   - Enter: `api.rugrel.in`
   - Click "Add Domain"

3. **Add DNS Record for API**
   **In your DNS provider, add:**
   ```
   Type: CNAME
   Name: api
   Target/Value: medixscan-production.up.railway.app
   TTL: 3600
   ```

#### Step C: Update Frontend Configuration

**Create/Update: `frontend/.env.production`**
```env
VITE_API_BASE_URL=https://api.rugrel.in/api
VITE_BACKEND_URL=https://api.rugrel.in
```

**Redeploy Frontend:**
- In Vercel dashboard → Deployments
- Click "Redeploy" on latest deployment
- Or push any small change to trigger redeploy

---

## 📋 **DNS Configuration Examples by Provider**

### Cloudflare
```
Type: CNAME | Name: www | Content: cname.vercel-dns.com | Proxy: Off
Type: A     | Name: @   | Content: 76.76.19.19 | Proxy: Off
Type: CNAME | Name: api | Content: medixscan-production.up.railway.app | Proxy: Off
```

### GoDaddy
```
Type: CNAME | Host: www | Points to: cname.vercel-dns.com | TTL: 1 Hour
Type: A     | Host: @   | Points to: 76.76.19.19 | TTL: 1 Hour  
Type: CNAME | Host: api | Points to: medixscan-production.up.railway.app | TTL: 1 Hour
```

### Namecheap
```
Type: CNAME Record | Host: www | Value: cname.vercel-dns.com | TTL: Automatic
Type: A Record     | Host: @   | Value: 76.76.19.19 | TTL: Automatic
Type: CNAME Record | Host: api | Value: medixscan-production.up.railway.app | TTL: Automatic
```

---

## ⏱️ **Timeline & Verification**

### What to Expect:
1. **DNS Records Added**: Immediately in your DNS provider
2. **DNS Propagation**: 5 minutes to 24 hours (usually 15-30 minutes)
3. **SSL Certificate**: Automatic by Vercel (5-15 minutes after DNS)
4. **Full Functionality**: Within 1 hour typically

### Check Progress:
1. **Vercel Dashboard**: Domain status changes to "Valid Configuration"
2. **Railway Dashboard**: Domain shows "Active" status
3. **Browser Test**: https://www.rugrel.in loads your app
4. **API Test**: https://api.rugrel.in/health/ returns JSON response

---

## 🔧 **Troubleshooting Common Issues**

### 1. DNS Not Propagating
- **Wait longer**: DNS can take up to 24 hours
- **Check multiple locations**: Use https://dnschecker.org
- **Clear browser cache**: Try incognito mode

### 2. SSL Certificate Issues
- **Wait for DNS**: SSL only works after DNS propagates
- **Check Vercel status**: Look for certificate status in dashboard
- **Force refresh**: Sometimes takes 2-3 attempts

### 3. API CORS Errors
After setting up api.rugrel.in, update your Django backend:

**In `backend_fixed/settings.py`:**
```python
ALLOWED_HOSTS = [
    'medixscan-production.up.railway.app',
    'api.rugrel.in',
    'localhost',
    '127.0.0.1'
]

CORS_ALLOWED_ORIGINS = [
    "https://www.rugrel.in",
    "https://rugrel.in", 
    "https://medixscan.vercel.app",
    "http://localhost:3000"
]
```

---

## 🎉 **Quick Start (Simplest Approach)**

**For fastest setup, do this:**

1. **Vercel Dashboard** → Your Project → Settings → Domains
2. **Add**: `www.rugrel.in`
3. **Copy the DNS records** Vercel shows you
4. **Add those records** to your DNS provider
5. **Wait 30 minutes** and test https://www.rugrel.in

This gets your main application on your custom domain immediately!

---

## 📞 **Need Help?**

### Vercel Support:
- Dashboard: Check domain status messages
- Docs: https://vercel.com/docs/custom-domains

### Railway Support:
- Dashboard: Domain configuration status
- Docs: https://docs.railway.app/deploy/custom-domains

### DNS Providers:
- Most have live chat or documentation for adding CNAME/A records

**Remember**: The key is patience - DNS changes take time to propagate worldwide!