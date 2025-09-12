# 📁 Project Structure Documentation

## Current Directory Structure

```
radiology_v2/
├── 📄 README.md                    # Main project documentation
├── 📄 SERVER_STARTUP_GUIDE.md      # Server startup instructions
├── 📄 package.json                # Node.js dependencies
├── 📄 start-system.bat            # System startup script
├── 🖥️ api-server.js               # Complete backend API server
├── 📁 frontend/                   # React frontend application ⭐
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📁 src/
│   │   ├── 📁 views/
│   │   │   ├── LandingPage.jsx    # Main landing page with testimonials
│   │   │   └── extra-pages/
│   │   │       └── privacy-policy.jsx
│   │   ├── 📁 config/
│   │   │   └── landingPageConfig.js  # Testimonials configuration
│   │   └── ...
│   └── ...
├── 📁 backend_fixed/              # Django backend (legacy)
├── 📁 documentation/              # All documentation files
└── ...
```

## ⚠️ Important Notes

### Frontend Location
- **Current:** `frontend/` folder
- **Previous:** `CODE-REACT/` (renamed for security)
- **Startup:** Always use `cd frontend && npm run dev`

### Server URLs
- **Frontend:** http://localhost:5175
- **Backend:** http://localhost:3000

### Common Mistakes
❌ **WRONG:** `cd CODE-REACT && npm run dev` (folder doesn't exist)
✅ **CORRECT:** `cd frontend && npm run dev`

❌ **WRONG:** Running `npm run dev` from root directory
✅ **CORRECT:** Change to frontend directory first

## Quick Commands

```bash
# Start frontend server
cd frontend
npm run dev

# Start backend server
node api-server.js

# Start complete system
start-system.bat
```

---
**Last Updated:** After CODE-REACT → frontend folder rename for security
