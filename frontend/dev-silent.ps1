# Silent Frontend Development Script
# Completely suppresses SASS deprecation warnings from terminal output

param(
    [switch]$Build,
    [switch]$Dev,
    [switch]$Preview
)

# Set environment variables to suppress SASS warnings
$env:SASS_SILENCE_DEPRECATIONS = "true"
$env:NODE_ENV = "development"
$env:VITE_SUPPRESS_WARNINGS = "true"

# SASS warning patterns to filter out
$suppressPatterns = @(
    "Deprecation Warning",
    "legacy-js-api",
    "import.*deprecated",
    "color-functions.*deprecated", 
    "global-builtin.*deprecated",
    "repetitive deprecation warnings omitted",
    "sass.*@import.*deprecated",
    "red\(\).*deprecated",
    "green\(\).*deprecated",
    "blue\(\).*deprecated"
)

# Function to filter SASS warnings from output
function Filter-SassWarnings {
    param([string]$Line)
    
    foreach ($pattern in $suppressPatterns) {
        if ($Line -match $pattern) {
            return $false
        }
    }
    return $true
}

# Function to run npm command with filtered output
function Run-FilteredCommand {
    param([string]$Command)
    
    Write-Host "🚀 Starting clean frontend development (SASS warnings suppressed)..." -ForegroundColor Green
    Write-Host "Command: $Command" -ForegroundColor Cyan
    Write-Host ""
    
    # Start the process and capture output
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d `"$PWD`" && $Command" -PassThru -NoNewWindow -RedirectStandardOutput -RedirectStandardError
    
    # Create background jobs to read output streams
    $outputJob = Start-Job -ScriptBlock {
        param($process, $patterns)
        while (!$process.HasExited) {
            $line = $process.StandardOutput.ReadLine()
            if ($line -and $line.Trim() -ne "") {
                $shouldShow = $true
                foreach ($pattern in $patterns) {
                    if ($line -match $pattern) {
                        $shouldShow = $false
                        break
                    }
                }
                if ($shouldShow) {
                    Write-Output $line
                }
            }
        }
    } -ArgumentList $process, $suppressPatterns
    
    $errorJob = Start-Job -ScriptBlock {
        param($process, $patterns)
        while (!$process.HasExited) {
            $line = $process.StandardError.ReadLine()
            if ($line -and $line.Trim() -ne "") {
                $shouldShow = $true
                foreach ($pattern in $patterns) {
                    if ($line -match $pattern) {
                        $shouldShow = $false
                        break
                    }
                }
                if ($shouldShow) {
                    Write-Error $line
                }
            }
        }
    } -ArgumentList $process, $suppressPatterns
    
    # Wait for process to complete
    $process.WaitForExit()
    
    # Clean up jobs
    Stop-Job $outputJob, $errorJob -ErrorAction SilentlyContinue
    Remove-Job $outputJob, $errorJob -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "✅ Frontend process completed (exit code: $($process.ExitCode))" -ForegroundColor Green
}

# Change to frontend directory
$frontendPath = "d:\radiology_v2\frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
} else {
    Write-Error "Frontend directory not found: $frontendPath"
    exit 1
}

# Execute based on parameters
if ($Build) {
    Run-FilteredCommand "npm run build"
} elseif ($Preview) {
    Run-FilteredCommand "npm run preview"
} else {
    # Default to dev mode
    Run-FilteredCommand "npm run dev"
}
