# Vercel Deployment Debug Test
# ============================

Write-Host "🔍 Testing Vercel Deployment Status..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Root page
Write-Host "1. Testing root page..." -ForegroundColor Yellow
try {
    $root = Invoke-WebRequest -Uri "https://www.rugrel.in" -Method GET -Headers @{"Cache-Control"="no-cache"}
    Write-Host "   ✅ Root page: $($root.StatusCode) - Cache Age: $($root.Headers["Age"])" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Root page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Sign-in page
Write-Host "2. Testing sign-in page..." -ForegroundColor Yellow
try {
    $signin = Invoke-WebRequest -Uri "https://www.rugrel.in/auth/sign-in" -Method GET -Headers @{"Cache-Control"="no-cache"}
    Write-Host "   ✅ Sign-in page: $($signin.StatusCode) - Cache Age: $($signin.Headers["Age"])" -ForegroundColor Green
    
    # Check if it's returning the index.html (SPA behavior)
    if ($signin.Content -like "*<title>*") {
        Write-Host "   📄 Returning HTML content (expected for SPA)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Sign-in page failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Alternative routes
$routes = @("/auth/login", "/auth/simple-login", "/auth/modern-signin")
foreach ($route in $routes) {
    Write-Host "3. Testing route: $route..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://www.rugrel.in$route" -Method GET -Headers @{"Cache-Control"="no-cache"}
        Write-Host "   ✅ $route : $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $route failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Check if JavaScript is being served
Write-Host "4. Testing JavaScript assets..." -ForegroundColor Yellow
try {
    $jsTest = Invoke-WebRequest -Uri "https://www.rugrel.in" -Method GET
    if ($jsTest.Content -like "*<script*") {
        Write-Host "   ✅ JavaScript files are being loaded" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No JavaScript detected in HTML" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Could not check JavaScript: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Debug test completed." -ForegroundColor Cyan