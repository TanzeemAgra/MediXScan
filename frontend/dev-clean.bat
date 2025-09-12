@echo off
REM Silent Frontend Development - Batch Script Version
REM Suppresses SASS deprecation warnings completely

cd /d "d:\radiology_v2\frontend"

REM Set environment variables to suppress SASS warnings
set SASS_SILENCE_DEPRECATIONS=true
set NODE_ENV=development
set VITE_SUPPRESS_WARNINGS=true

echo 🚀 Starting clean frontend development (SASS warnings suppressed)...
echo.

REM Use PowerShell to filter output in real-time
powershell -Command "& { npm run dev 2>&1 | Where-Object { $_ -notmatch 'Deprecation Warning' -and $_ -notmatch 'legacy-js-api' -and $_ -notmatch 'import.*deprecated' -and $_ -notmatch 'color-functions.*deprecated' -and $_ -notmatch 'global-builtin.*deprecated' -and $_ -notmatch 'repetitive deprecation warnings' } }"

pause
