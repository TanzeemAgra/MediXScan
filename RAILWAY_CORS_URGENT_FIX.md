# 🚨 URGENT: Railway Environment Variables Fix
## THIS MUST BE DONE IMMEDIATELY

### Go to Railway Dashboard:
1. https://railway.app/dashboard  
2. Select: medixscan-production
3. Go to: Variables tab
4. Add these EXACT variables:

### CRITICAL CORS FIX (Copy-Paste Exactly):

```
CORS_ALLOW_ALL_ORIGINS
```
**Value:** `True`

```
CORS_ALLOWED_ORIGINS  
```
**Value:** `https://www.rugrel.in,https://rugrel.in,https://medixscan.vercel.app`

```
ALLOWED_HOSTS
```  
**Value:** `*`

```
DEBUG
```
**Value:** `True`

### After Adding Variables:
- Click "Save" after each variable
- Railway will redeploy (wait 2-3 minutes)
- Test login immediately

### VERIFICATION:
Once added, this command should show CORS headers:
```bash
curl -H "Origin: https://www.rugrel.in" -I https://medixscan-production.up.railway.app/api/auth/emergency-login/
```

## 🎯 Expected Result:
- CORS errors disappear
- Login works at https://www.rugrel.in/auth/sign-in  
- No more "Access-Control-Allow-Origin" errors

**THIS IS THE PRIMARY BLOCKER - FIX THIS FIRST!** 🚨