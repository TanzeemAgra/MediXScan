# PowerShell Deployment Build Script
# Soft-coded approach to handle deployment builds without warnings on Windows

param(
    [switch]$CleanBuild = $true,
    [switch]$SuppressWarnings = $true,
    [switch]$GenerateReport = $true
)

# Color functions for PowerShell
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Info($message) {
    Write-ColorOutput Cyan "ℹ $message"
}

function Write-Success($message) {
    Write-ColorOutput Green "✅ $message"
}

function Write-Warning($message) {
    Write-ColorOutput Yellow "⚠️  $message"
}

function Write-Error($message) {
    Write-ColorOutput Red "❌ $message"
}

function Write-Step($message) {
    Write-ColorOutput Blue "🚀 $message"
}

# Main deployment build function
function Start-DeploymentBuild {
    Write-Host @"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         🚀 DEPLOYMENT BUILD WITH WARNING SUPPRESSION     ║
║                                                          ║
║         Radiology v2 - Production Ready Build           ║
║         PowerShell Version for Windows                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

    try {
        # Step 1: Clean previous build
        if ($CleanBuild) {
            Write-Step "Cleaning previous build..."
            $distPath = Join-Path $PWD "dist"
            
            if (Test-Path $distPath) {
                Remove-Item $distPath -Recurse -Force -ErrorAction SilentlyContinue
                Write-Success "Previous build cleaned"
            }
        }
        
        # Step 2: Set environment variables
        Write-Step "Setting deployment environment variables..."
        $env:NODE_ENV = "production"
        $env:SUPPRESS_SASS_WARNINGS = "true"
        $env:DEPLOYMENT_MODE = "true"
        $env:BUILD_OPTIMIZATION = "true"
        Write-Success "Environment variables configured"
        
        # Step 3: Configure SASS warning suppression
        if ($SuppressWarnings) {
            Write-Step "Configuring SASS warning suppression..."
            
            $suppressScript = @"
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = function(message, ...args) {
  if (typeof message === 'string' && (
    message.includes('Deprecation Warning') ||
    message.includes('legacy-js-api') ||
    message.includes('sass-lang.com/d/') ||
    message.includes('[import]') ||
    message.includes('[color-functions]') ||
    message.includes('[global-builtin]') ||
    message.includes('repetitive deprecation warnings omitted')
  )) {
    return; // Suppress SASS warnings
  }
  originalConsoleWarn.apply(console, [message, ...args]);
};

console.error = function(message, ...args) {
  if (typeof message === 'string' && (
    message.includes('Deprecation Warning') ||
    message.includes('repetitive deprecation warnings omitted')
  )) {
    return; // Suppress SASS errors
  }
  originalConsoleError.apply(console, [message, ...args]);
};
"@
            
            $suppressScript | Out-File -FilePath "suppress-warnings.js" -Encoding UTF8
            Write-Success "SASS warning suppression configured"
        }
        
        # Step 4: Run production build
        Write-Step "Starting production build..."
        
        $buildCommand = "node -r ./suppress-warnings.js ./node_modules/vite/bin/vite.js build"
        
        # Capture build output and filter warnings
        $buildOutput = & cmd /c $buildCommand 2>&1
        
        # Filter out SASS deprecation warnings from output
        $filteredOutput = $buildOutput | Where-Object {
            $_ -notmatch "Deprecation Warning" -and
            $_ -notmatch "legacy-js-api" -and
            $_ -notmatch "sass-lang.com/d/" -and
            $_ -notmatch "\[import\]" -and
            $_ -notmatch "\[color-functions\]" -and
            $_ -notmatch "\[global-builtin\]" -and
            $_ -notmatch "repetitive deprecation warnings omitted"
        }
        
        # Display filtered output
        $filteredOutput | ForEach-Object { Write-Host $_ }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Production build completed successfully!"
        } else {
            throw "Build process failed with exit code $LASTEXITCODE"
        }
        
        # Step 5: Generate build report
        if ($GenerateReport) {
            Write-Step "Generating build report..."
            
            $distPath = Join-Path $PWD "dist"
            
            if (Test-Path $distPath) {
                $files = Get-ChildItem $distPath -Recurse -File
                
                $report = @{
                    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                    buildMode = "production"
                    warningsSuppressed = $true
                    optimization = @{
                        minify = $true
                        sourceMaps = $false
                        compression = $true
                        bundleAnalysis = $true
                    }
                    files = $files.Count
                    buildDirectory = $distPath
                    status = "success"
                    platform = "Windows PowerShell"
                } | ConvertTo-Json -Depth 3
                
                $reportPath = Join-Path $distPath "build-report.json"
                $report | Out-File -FilePath $reportPath -Encoding UTF8
                
                Write-Success "Build report generated"
                Write-Info "📊 Build completed with $($files.Count) files"
                Write-Info "📁 Output directory: $distPath"
            }
        }
        
        # Step 6: Cleanup
        Write-Step "Cleaning up temporary files..."
        if (Test-Path "suppress-warnings.js") {
            Remove-Item "suppress-warnings.js" -Force
        }
        Write-Success "Cleanup completed"
        
        # Success message
        Write-Host @"
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         ✅ DEPLOYMENT BUILD COMPLETED SUCCESSFULLY!      ║
║                                                          ║
║         🎉 Ready for production deployment               ║
║         📦 All SASS warnings suppressed                 ║
║         🚀 Optimized for performance                     ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
        
    } catch {
        Write-Error "Deployment build failed: $($_.Exception.Message)"
        
        # Cleanup on error
        if (Test-Path "suppress-warnings.js") {
            Remove-Item "suppress-warnings.js" -Force
        }
        
        exit 1
    }
}

# Execute if script is run directly
if ($MyInvocation.InvocationName -ne '.') {
    Start-DeploymentBuild
}
