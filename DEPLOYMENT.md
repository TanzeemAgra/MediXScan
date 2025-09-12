# 🚀 Deployment Guide

## Local Development

### Frontend Deployment
```bash
# From root directory
cd frontend
npm install
npm run dev
```
**Frontend URL:** http://localhost:5175

### Backend Deployment
```bash
# From root directory
npm install
node api-server.js
```
**Backend URL:** http://localhost:3000

## Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Docker Deployment
```bash
# Use provided Docker configuration
docker-compose up -d
```

## Important Notes

- Frontend is in `frontend/` folder (NOT CODE-REACT)
- Always navigate to frontend directory before running npm commands
- Check `SERVER_STARTUP_GUIDE.md` for detailed startup instructions

---
**Updated:** After folder restructure for security compliance