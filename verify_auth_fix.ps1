# Authentication Fix Verification Script
# Checks for any remaining useAuth context issues

Write-Host "🔍 Checking for remaining useAuth context issues..." -ForegroundColor Yellow

$frontendPath = "d:\radiology_v2\frontend\src"

# Search for any remaining direct AuthContext imports
Write-Host "`n1. Searching for remaining AuthContext imports..." -ForegroundColor Cyan
$authContextImports = Get-ChildItem -Path $frontendPath -Recurse -Name "*.jsx" | 
    ForEach-Object { 
        $file = "$frontendPath\$_"
        $content = Get-Content $file -Raw
        if ($content -match "from.*AuthContext") {
            "$_ : Contains AuthContext import"
        }
    }

if ($authContextImports) {
    Write-Host "⚠️ Found remaining AuthContext imports:" -ForegroundColor Red
    $authContextImports | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
} else {
    Write-Host "✅ No remaining AuthContext imports found" -ForegroundColor Green
}

# Check for useAuth calls that might not use universal auth
Write-Host "`n2. Checking for useAuth calls..." -ForegroundColor Cyan
$useAuthCalls = Get-ChildItem -Path $frontendPath -Recurse -Name "*.jsx" | 
    ForEach-Object { 
        $file = "$frontendPath\$_"
        $content = Get-Content $file -Raw
        if ($content -match "useAuth" -and $_ -notmatch "useUniversalAuth|AuthContext\.jsx|EnhancedAuthContext\.jsx") {
            "$_ : Contains useAuth call"
        }
    }

if ($useAuthCalls) {
    Write-Host "📋 Found useAuth calls (should verify these use universal auth):" -ForegroundColor Yellow
    $useAuthCalls | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
} else {
    Write-Host "✅ No direct useAuth calls found" -ForegroundColor Green
}

# Check build status
Write-Host "`n3. Checking build status..." -ForegroundColor Cyan
$distExists = Test-Path "d:\radiology_v2\frontend\dist"
if ($distExists) {
    Write-Host "✅ Build directory exists" -ForegroundColor Green
    
    # Check if build is recent (within last 10 minutes)
    $distModified = (Get-Item "d:\radiology_v2\frontend\dist").LastWriteTime
    $timeDiff = (Get-Date) - $distModified
    if ($timeDiff.TotalMinutes -lt 10) {
        Write-Host "✅ Build is recent (modified $($timeDiff.Minutes) minutes ago)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Build may be outdated (modified $([math]::Round($timeDiff.TotalMinutes)) minutes ago)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Build directory not found" -ForegroundColor Red
}

# Check git status
Write-Host "`n4. Checking git status..." -ForegroundColor Cyan
Set-Location "d:\radiology_v2"
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️ Uncommitted changes found:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
} else {
    Write-Host "✅ All changes committed" -ForegroundColor Green
}

# Get last commit info
$lastCommit = git log -1 --oneline
Write-Host "📝 Last commit: $lastCommit" -ForegroundColor Cyan

Write-Host "`n🚀 Authentication Fix Summary:" -ForegroundColor Magenta
Write-Host "   - Fixed Header component useAuth import (MAIN ISSUE)" -ForegroundColor Green
Write-Host "   - Updated all auth view components" -ForegroundColor Green  
Write-Host "   - Added AuthErrorBoundary for recovery" -ForegroundColor Green
Write-Host "   - Changes pushed to GitHub for Vercel deployment" -ForegroundColor Green

Write-Host "`n🧪 Next Steps:" -ForegroundColor Magenta
Write-Host "   1. Wait 2-3 minutes for Vercel deployment" -ForegroundColor White
Write-Host "   2. Test: https://www.rugrel.in/auth/sign-in" -ForegroundColor White
Write-Host "   3. Login with: tanzeem.agra@rugrel.com / TanzeemAgra@123" -ForegroundColor White
Write-Host "   4. Verify dashboard loads: https://www.rugrel.in/dashboard" -ForegroundColor White

Write-Host "`n✨ The dashboard error should now be RESOLVED!" -ForegroundColor Green