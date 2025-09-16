# Railway CORS Fix Script
# ========================
# This script provides the corrected CORS_ALLOWED_ORIGINS value for Railway

Write-Host "🔧 CORS Configuration Fix for Railway" -ForegroundColor Cyan
Write-Host ""

# The CORRECTED CORS_ALLOWED_ORIGINS value for Railway
$correctedCORS = @(
    "https://www.rugrel.in",
    "https://rugrel.in", 
    "https://medixscan.vercel.app",
    "https://medixscan-rug.vercel.app",
    "https://medixscan-git-main-xerxezs-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:5175",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5175",
    "https://medixscan-production.up.railway.app"  # ✅ FIXED: Added https://
)

# Create the corrected comma-separated string
$correctedString = $correctedCORS -join ","

Write-Host "❌ PROBLEMATIC (current) value:" -ForegroundColor Red
Write-Host "medixscan-production.up.railway.app" -ForegroundColor Red
Write-Host ""

Write-Host "✅ CORRECTED value for Railway environment variable:" -ForegroundColor Green  
Write-Host "CORS_ALLOWED_ORIGINS = $correctedString" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Copy this corrected value and update it in Railway:" -ForegroundColor Yellow
Write-Host $correctedString -ForegroundColor White
Write-Host ""

Write-Host "🚀 Steps to fix in Railway:" -ForegroundColor Cyan
Write-Host "1. Go to Railway dashboard" -ForegroundColor White
Write-Host "2. Select your MediXScan project" -ForegroundColor White  
Write-Host "3. Go to Variables tab" -ForegroundColor White
Write-Host "4. Find CORS_ALLOWED_ORIGINS" -ForegroundColor White
Write-Host "5. Replace the value with the corrected string above" -ForegroundColor White
Write-Host "6. Redeploy the application" -ForegroundColor White
Write-Host ""

# Also create an environment file for reference
$envContent = @"
# Corrected CORS Configuration for Railway
# Copy this value to Railway environment variables

CORS_ALLOWED_ORIGINS=$correctedString
"@

$envContent | Out-File -FilePath "d:\radiology_v2\RAILWAY_CORS_FIX.env" -Encoding UTF8

Write-Host "💾 Corrected configuration saved to: RAILWAY_CORS_FIX.env" -ForegroundColor Green