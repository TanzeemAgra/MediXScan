# 🚀 Server Startup Guide

## Frontend Server

To start the frontend development server:

```bash
# From root directory
cd frontend
npm run dev
```

**Important:** 
- The frontend is located in the `frontend` folder (NOT CODE-REACT)
- Always use `cd frontend` before running `npm run dev`
- Frontend runs on: http://localhost:5175

## Backend Server

To start the backend server:

```bash
# From root directory
node api-server.js
```

## Complete System Startup

```bash
# Option 1: Use the startup script
start-system.bat

# Option 2: Manual startup
# Terminal 1: node api-server.js
# Terminal 2: cd frontend && npm run dev
```

## Troubleshooting

- **Error: Missing script 'dev'** - You're not in the frontend directory
- **Solution:** Always run `cd frontend` first
- **Port conflicts:** Frontend uses 5175, backend uses 3000

---
**Remember: Frontend is in `frontend` folder, not CODE-REACT!**