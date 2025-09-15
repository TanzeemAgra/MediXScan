$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "tanzeem.agra@rugrel.com"
    password = "Tanzilla@tanzeem786"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" -Method POST -Body $body -Headers $headers
    Write-Host "=== LOGIN SUCCESS ===" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "=== LOGIN ERROR ===" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody"
    } catch {
        Write-Host "Could not read error details"
    }
}
