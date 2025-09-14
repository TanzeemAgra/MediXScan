@echo off
echo ===============================================
echo MediXScan Railway Migration Helper
echo ===============================================
echo.

echo Setting up environment...
cd /d "D:\radiology_v2\backend"

echo.
echo Choose migration option:
echo 1. Full migration (backup + analysis + commands)
echo 2. Backup only
echo 3. Analysis only  
echo 4. Generate commands only
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Running full migration...
    python railway_migration_helper.py --all
) else if "%choice%"=="2" (
    echo Creating backup...
    python railway_migration_helper.py --backup
) else if "%choice%"=="3" (
    echo Analyzing database...
    python railway_migration_helper.py --analyze
) else if "%choice%"=="4" (
    echo Generating commands...
    python railway_migration_helper.py --commands
) else (
    echo Invalid choice. Exiting...
    goto end
)

echo.
echo ===============================================
echo Migration helper completed!
echo Check the database_backups folder for results.
echo ===============================================

:end
pause