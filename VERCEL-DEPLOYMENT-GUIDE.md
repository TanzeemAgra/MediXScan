# Vercel Frontend Deployment Guide

## 📋 **Prerequisites**
- ✅ Railway Backend deployed and working: `https://medixscan-production.up.railway.app`
- ✅ GitHub repository with frontend code: `TanzeemAgra/MediXScan`

## 🚀 **Step 1: Vercel Account Setup**

1. **Go to Vercel:** https://vercel.com
2. **Sign up/Login** with GitHub account
3. **Connect your GitHub** repository

## 📂 **Step 2: Import Project to Vercel**

1. **Click "New Project"** in Vercel Dashboard
2. **Import Git Repository:** Select `TanzeemAgra/MediXScan`
3. **Configure Project:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (important!)
   - **Build Command:** `npm run build` (default is fine)
   - **Output Directory:** `dist` (default is fine)
   - **Install Command:** `npm install` (default is fine)

## 🔧 **Step 3: Environment Variables**

In Vercel Project Settings → Environment Variables, add these **ONE BY ONE**:

### **Required Environment Variables:**
```
Name: VITE_API_BASE_URL
Value: https://medixscan-production.up.railway.app/api
Environment: Production

Name: VITE_BACKEND_URL  
Value: https://medixscan-production.up.railway.app
Environment: Production

Name: VITE_FRONTEND_URL
Value: https://your-vercel-app-name.vercel.app
Environment: Production

Name: VITE_ENABLE_CHATBOT
Value: true
Environment: Production

Name: VITE_ENABLE_COMPLIANCE
Value: true
Environment: Production

Name: VITE_DEBUG_MODE
Value: false
Environment: Production

Name: VITE_ENABLE_MOCK_DATA
Value: false
Environment: Production

Name: VITE_GRACEFUL_DEGRADATION
Value: true
Environment: Production

Name: VITE_API_TIMEOUT
Value: 10000
Environment: Production

Name: VITE_APP_VERSION
Value: 1.0.0
Environment: Production
```

### **Important Notes:**
- Add each variable **individually** in Vercel dashboard
- Set all to **"Production"** environment (not Preview/Development)
- Update `VITE_FRONTEND_URL` after getting your Vercel deployment URL

## 🏗️ **Step 4: Deploy**

1. **Click "Deploy"** - Vercel will automatically build and deploy
2. **Wait for deployment** (usually 2-3 minutes)
3. **Get your Vercel URL** (e.g., `https://your-app-name.vercel.app`)

## 🔄 **Step 5: Update Backend CORS**

After getting your Vercel URL, update Railway backend CORS settings:

1. **Go to Railway Django Service** → **Variables**
2. **Update CORS variable:**
   ```
   CORS_ALLOWED_ORIGINS = https://your-vercel-app-name.vercel.app,http://localhost:3000
   ```
3. **Railway will auto-redeploy**

## 🧪 **Step 6: Test Deployment**

### **Test Frontend:**
- Visit your Vercel URL
- Check if the app loads without errors
- Test login/authentication features

### **Test API Connection:**
- Open browser developer tools
- Check Network tab for API calls
- Verify API calls go to Railway backend

## 🔧 **Step 7: Custom Domain (Optional)**

1. **Go to Vercel Project** → **Settings** → **Domains**
2. **Add your custom domain**
3. **Update DNS records** as instructed by Vercel
4. **Update environment variables** with new domain

## ⚡ **Quick Start Commands:**

After Vercel setup, for future deployments:
```bash
# Local testing with production config
npm run build:production
npm run preview

# Vercel will auto-deploy on git push to main branch
```

## 🎯 **Expected Results:**

- ✅ **Frontend deployed** on Vercel
- ✅ **API calls working** to Railway backend  
- ✅ **Authentication working** between frontend and backend
- ✅ **CORS configured** properly for cross-origin requests

## 🔍 **Troubleshooting:**

### **If API calls fail:**
1. Check Vercel environment variables
2. Check Railway CORS configuration
3. Check Network tab in browser developer tools

### **If build fails:**
1. Check Vercel build logs
2. Verify `frontend` root directory is set
3. Check for missing dependencies in package.json

## 📞 **Next Steps:**

After successful deployment:
1. Update README with live URLs
2. Set up automatic deployments
3. Configure production monitoring
4. Set up SSL certificates (automatic with Vercel)