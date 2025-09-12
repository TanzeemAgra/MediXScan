@echo off
echo Starting Database User Cleanup...
echo.

cd /d "d:\radiology_v2\backend"

echo Current directory: %CD%
echo.

echo Checking users in database...
python user_cleanup_final.py

echo.
echo Script completed.
pause
