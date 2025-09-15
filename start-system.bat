@echo off
title Radiology RBAC System
echo ========================================
echo    🏥 Radiology RBAC System Startup
echo ========================================
echo.

echo 🚀 Starting API Server...
start "API Server" powershell -NoExit -Command "cd 'd:\radiology_v2'; node api-server.js"
timeout /t 3 >nul

echo 🌐 Starting Frontend...
start "Frontend" powershell -NoExit -Command "cd 'd:\radiology_v2\frontend'; npm run dev"
timeout /t 5 >nul

echo.
echo ✅ System Started Successfully!
echo.
echo 🔗 URLs:
echo   • Frontend: http://localhost:5175
echo   • Login: http://localhost:5175/auth/sign-in  
echo   • RBAC: http://localhost:5175/dashboard/rbac-user-management
echo.
echo 🔐 Credentials: admin / admin123
echo.
pause
