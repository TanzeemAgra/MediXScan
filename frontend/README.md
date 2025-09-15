# MediXScan Frontend

React-based frontend for the MediXScan radiology application.

## Deployment Status
- **Production**: https://medixscan-rug.vercel.app/
- **Backend API**: https://medixscan-production.up.railway.app/api/

## Environment Variables
The following environment variables are configured for production:
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_BACKEND_URL`: Backend base URL
- `VITE_ENABLE_CHATBOT`: Enable chatbot features
- `VITE_ENABLE_COMPLIANCE`: Enable compliance features

## Automated Deployment
This frontend automatically deploys to Vercel when changes are pushed to the main branch.