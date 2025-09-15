# Custom Domain Configuration Guide for MediXScan
## Connecting www.rugrel.in to Your Application

### Overview
Your MediXScan application consists of:
- **Frontend**: Currently at https://medixscan.vercel.app (React/Vite)
- **Backend**: Currently at https://medixscan-production.up.railway.app (Django API)
- **Custom Domain**: www.rugrel.in (to be configured)

## Option 1: Frontend on Custom Domain (Recommended)

### Step 1: Configure Vercel for www.rugrel.in

1. **Login to Vercel Dashboard**
   ```bash
   # If not logged in via CLI
   vercel login
   ```

2. **Add Custom Domain via Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your `medixscan` project
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: `www.rugrel.in`
   - Also add: `rugrel.in` (root domain)

3. **Or Add Domain via CLI**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Add custom domain
   vercel domains add www.rugrel.in
   vercel domains add rugrel.in
   ```

### Step 2: Configure DNS Records

**In your DNS provider (where you manage rugrel.in):**

#### For www.rugrel.in:
```dns
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### For root domain rugrel.in:
```dns
Type: A
Name: @ (or root/blank)
Value: 76.76.19.19
TTL: 3600

Type: AAAA  
Name: @ (or root/blank)
Value: 2606:4700:90:0:76:76:19:19
TTL: 3600
```

#### Alternative for root domain (if CNAME supported):
```dns
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Verify Domain Configuration

```bash
# Check DNS propagation
nslookup www.rugrel.in
nslookup rugrel.in

# Test domain
curl -I https://www.rugrel.in
```

## Option 2: Both Frontend and Backend on Custom Domain

### Frontend: www.rugrel.in
### Backend API: api.rugrel.in

#### Step 1: Configure Subdomains

**DNS Records:**
```dns
# Frontend
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# Backend API
Type: CNAME  
Name: api
Value: medixscan-production.up.railway.app
```

#### Step 2: Configure Railway Custom Domain

1. **Railway Dashboard**
   - Go to https://railway.app/dashboard
   - Select your `medixscan-production` project
   - Go to Settings → Domains
   - Click "Custom Domain"
   - Add: `api.rugrel.in`

2. **Or via Railway CLI**
   ```bash
   # Install Railway CLI if needed
   npm install -g @railway/cli
   
   # Login and link project
   railway login
   railway link
   
   # Add custom domain
   railway domain add api.rugrel.in
   ```

#### Step 3: Update Frontend API Configuration

Update your frontend to use the new API domain:

**File: `frontend/.env.production`**
```env
VITE_API_BASE_URL=https://api.rugrel.in/api
VITE_BACKEND_URL=https://api.rugrel.in
```

**File: `frontend/src/services/api.js`**
```javascript
// Update base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.rugrel.in/api';
```

## Option 3: Complete Custom Domain Setup

### All services under rugrel.in:
- **Main App**: https://www.rugrel.in (or https://rugrel.in)
- **API**: https://api.rugrel.in  
- **Admin**: https://admin.rugrel.in (optional)
- **Docs**: https://docs.rugrel.in (optional)

#### DNS Configuration:
```dns
# Main domain (frontend)
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19

# API subdomain (backend)
Type: CNAME
Name: api  
Value: medixscan-production.up.railway.app

# Optional subdomains
Type: CNAME
Name: admin
Value: cname.vercel-dns.com

Type: CNAME
Name: docs
Value: cname.vercel-dns.com
```

## Implementation Steps

### 1. Immediate Setup (Frontend Only)

```bash
# 1. Add domain to Vercel
cd D:\radiology_v2\frontend
vercel domains add www.rugrel.in
vercel domains add rugrel.in

# 2. Deploy to ensure latest build
vercel --prod
```

### 2. Update DNS Records

Configure these in your DNS provider:
```dns
www.rugrel.in    CNAME    cname.vercel-dns.com
rugrel.in        A        76.76.19.19
rugrel.in        AAAA     2606:4700:90:0:76:76:19:19
```

### 3. SSL Certificate (Automatic)

Vercel automatically provisions SSL certificates for custom domains.
- Certificate will be issued within minutes
- HTTPS redirect is automatic

### 4. Test Configuration

```bash
# Test after DNS propagation (5-60 minutes)
curl -I https://www.rugrel.in
curl -I https://rugrel.in

# Check if redirect works
curl -I http://www.rugrel.in
```

## Configuration Files Update

### Update package.json for domain
```json
{
  "name": "medixscan",
  "homepage": "https://www.rugrel.in",
  "scripts": {
    "build": "vite build",
    "preview": "vite preview --host"
  }
}
```

### Update vite.config.js
```javascript
export default defineConfig({
  base: '/',
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
```

## Verification Checklist

- [ ] DNS records configured
- [ ] Domain added to Vercel
- [ ] SSL certificate issued
- [ ] Frontend accessible at www.rugrel.in
- [ ] API calls working from custom domain
- [ ] Authentication flow working
- [ ] RBAC features accessible

## Troubleshooting

### Common Issues:

1. **DNS Not Propagating**
   ```bash
   # Check multiple DNS servers
   nslookup www.rugrel.in 8.8.8.8
   nslookup www.rugrel.in 1.1.1.1
   ```

2. **SSL Certificate Issues**
   - Wait 24 hours for full propagation
   - Check Vercel dashboard for certificate status

3. **API CORS Issues**
   - Update Django ALLOWED_HOSTS
   - Add new domain to CORS settings

## Next Steps After Setup

1. Update all documentation with new domain
2. Update OAuth redirect URLs (if using social login)
3. Update any hardcoded URLs in the application
4. Set up monitoring for the custom domain
5. Configure CDN if needed for better performance

Would you like me to help you implement any specific option or need assistance with your DNS provider configuration?