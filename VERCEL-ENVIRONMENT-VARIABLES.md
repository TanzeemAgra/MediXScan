# Vercel Production Environment Variables
# Copy these to Vercel Dashboard → Project → Settings → Environment Variables

# Backend API Configuration
VITE_API_BASE_URL=https://medixscan-production.up.railway.app/api
VITE_BACKEND_URL=https://medixscan-production.up.railway.app
VITE_FRONTEND_URL=https://your-app-name.vercel.app

# Feature Flags for Production
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_COMPLIANCE=true
VITE_DEBUG_MODE=false
VITE_ENABLE_MOCK_DATA=false
VITE_GRACEFUL_DEGRADATION=true

# API Configuration
VITE_API_TIMEOUT=10000
VITE_UPLOAD_TIMEOUT=30000
VITE_DOWNLOAD_TIMEOUT=60000
VITE_MEDICAL_API_TIMEOUT=8000
VITE_FAST_API_TIMEOUT=5000

# Retry Configuration
VITE_RETRY_ATTEMPTS=3
VITE_RETRY_DELAY=1000

# App Information
VITE_APP_VERSION=1.0.0

# Default Settings
VITE_DEFAULT_MEDICAL_QUERY=lung