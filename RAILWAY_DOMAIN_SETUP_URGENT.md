# 🚀 Railway & DNS Configuration Guide
## Fix API Connection Issues for www.rugrel.in

## 🔥 **IMMEDIATE ACTION REQUIRED**

Your login issue is caused by **malformed API URLs and CORS blocking**. Here's the complete fix:

### 🔧 **Step 1: Railway Custom Domain Setup**

#### A. Add Custom Domain to Railway
1. **Login to Railway Dashboard**: https://railway.app/dashboard
2. **Select Project**: `medixscan-production`
3. **Go to Settings** → **Domains** 
4. **Click "Custom Domain"**
5. **Add Domain**: `api.rugrel.in`
6. **Click "Add"**

#### B. Alternative - Railway CLI Method
```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link medixscan-production

# Add custom domain
railway domain add api.rugrel.in
```

### 🌐 **Step 2: DNS Configuration**

#### Configure DNS in Your Domain Provider (rugrel.in):

**Add these DNS records:**

```dns
# For API subdomain (Backend)
Type: CNAME
Name: api
Value: medixscan-production.up.railway.app
TTL: 3600

# For frontend (if not already configured)
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# Root domain (if not configured)
Type: A
Name: @
Value: 76.76.19.19
TTL: 3600
```

### 🔄 **Step 3: Update Railway Environment Variables**

#### Go to Railway Dashboard → medixscan-production → Variables:

**Add/Update these variables:**

```env
# CORS Configuration (CRITICAL - Add your custom domains)
CORS_ALLOWED_ORIGINS=https://www.rugrel.in,https://rugrel.in,https://medixscan.vercel.app,https://medixscan-rug.vercel.app

# Allowed Hosts (Add custom domains)
ALLOWED_HOSTS=localhost,127.0.0.1,*.railway.app,*.vercel.app,rugrel.in,*.rugrel.in,www.rugrel.in,api.rugrel.in

# Debug (temporarily enable for testing)
DEBUG=True

# Security (temporarily disable for testing)
SECURE_SSL_REDIRECT=False
```

**🚨 IMPORTANT:** These exact variables must be added to Railway to fix CORS blocking.

### ⚡ **Step 4: Immediate Vercel Deployment**

```powershell
# Navigate to frontend
cd d:\radiology_v2\frontend

# Deploy with new configuration
vercel --prod

# Or if you want to ensure clean deployment
vercel build
vercel deploy --prod
```

### 🔍 **Step 5: Verification Commands**

After completing steps 1-4, test your setup:

```powershell
# Test DNS propagation
nslookup api.rugrel.in
nslookup www.rugrel.in

# Test API connectivity
curl -I https://api.rugrel.in/api/health/
curl -I https://www.rugrel.in

# Test CORS (should not show CORS errors)
curl -H "Origin: https://www.rugrel.in" https://api.rugrel.in/api/auth/check/
```

## 🛠️ **What We Fixed in Code:**

### ✅ **Fixed Malformed API URL Issue:**
- **Before**: `https://medixscan-production.up.railway.app/api,https://api.rugrel.in/api` (malformed with comma)
- **After**: Smart API selection with proper fallback

### ✅ **Enhanced Frontend Configuration:**
- Added Smart API Manager with domain detection
- Environment-based API URL selection
- Health check and fallback mechanisms
- Proper error handling

### ✅ **Updated Backend CORS:**
- Added `www.rugrel.in` and `rugrel.in` to allowed origins
- Updated `ALLOWED_HOSTS` for custom domain support
- Enhanced security headers configuration

## 🎯 **Expected Results After Setup:**

### ✅ **Immediate (5-15 minutes):**
- Railway accepts `api.rugrel.in` domain
- Vercel deploys updated frontend
- No more "malformed URL" errors in browser

### ✅ **After DNS Propagation (30-120 minutes):**
- `https://api.rugrel.in` resolves to your backend
- `https://www.rugrel.in` shows your frontend
- No CORS blocking errors
- Successful login functionality

## 🚨 **If Still Getting Errors:**

### **Temporary Fallback (Immediate Fix):**

1. **Update Railway Variable** `CORS_ALLOW_ALL_ORIGINS=True` (temporarily)
2. **Redeploy frontend** with `vercel --prod`
3. **Test login** at `https://www.rugrel.in/auth/sign-in`

### **Debug Commands:**
```powershell
# Check current API endpoint being used
# Open browser console on https://www.rugrel.in/auth/sign-in
# Look for: "🌐 Using API base URL: ..."
```

## 🎉 **Final Steps:**

1. ✅ **Complete Railway domain setup** (Step 1)
2. ✅ **Configure DNS records** (Step 2) 
3. ✅ **Update Railway environment** (Step 3)
4. ✅ **Deploy frontend** (Step 4)
5. ✅ **Test login** after 30 minutes

**Your login will work once Steps 1-3 are completed!** 🚀

## 📞 **Need Help?**

If you encounter any issues:
1. **Railway Domain Issues**: Check Railway dashboard → Domains section
2. **DNS Issues**: Use `nslookup api.rugrel.in` to verify
3. **CORS Issues**: Verify Railway environment variables are set correctly
4. **Still Stuck**: Enable `DEBUG=True` in Railway and check logs

**The fix is ready in code - you just need to configure Railway and DNS!** ⚡