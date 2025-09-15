# 🚨 RAILWAY CORS FIX - Execute these commands:
# Install Railway CLI if not installed: npm install -g @railway/cli
railway login
railway link medixscan-production

railway variables set CORS_ALLOW_ALL_ORIGINS="True"
railway variables set CORS_ALLOWED_ORIGINS="https://www.rugrel.in,https://rugrel.in,https://medixscan.vercel.app,https://medixscan-git-main-xerxezs-projects.vercel.app,https://medixscan-rug.vercel.app,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://medixscan-tanzeemun.vercel.app,https://medixscan-git-main.vercel.app"
railway variables set CORS_ALLOW_CREDENTIALS="True"
railway variables set CORS_ALLOW_HEADERS="accept,accept-encoding,authorization,content-type,dnt,origin,user-agent,x-csrftoken,x-requested-with"
railway variables set CORS_ALLOW_METHODS="DELETE,GET,OPTIONS,PATCH,POST,PUT"
railway variables set ALLOWED_HOSTS="medixscan-production.up.railway.app,*.railway.app,rugrel.in,*.rugrel.in,www.rugrel.in,api.rugrel.in,*.vercel.app,medixscan.vercel.app,medixscan-git-main-xerxezs-projects.vercel.app,medixscan-rug.vercel.app,localhost,127.0.0.1"
railway variables set SECURE_CROSS_ORIGIN_OPENER_POLICY="same-origin-allow-popups"
railway variables set SECURE_REFERRER_POLICY="strict-origin-when-cross-origin"
railway variables set DEBUG="True"
railway variables set DJANGO_LOG_LEVEL="INFO"
railway variables set CSRF_TRUSTED_ORIGINS="https://www.rugrel.in,https://rugrel.in,https://medixscan.vercel.app,https://medixscan-git-main-xerxezs-projects.vercel.app,https://medixscan-rug.vercel.app,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,https://medixscan-tanzeemun.vercel.app,https://medixscan-git-main.vercel.app"
railway variables set CSRF_COOKIE_SECURE="False"
railway variables set SESSION_COOKIE_SECURE="False"

# 🔄 Force redeploy after setting variables:
railway redeploy