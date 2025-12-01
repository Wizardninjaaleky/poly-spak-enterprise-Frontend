$body = @{
    email = "janekamunge4@gmail.com"
    password = "Jane2024!Admin"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    Write-Host "`n=== Testing Admin Login ===" -ForegroundColor Cyan
    Write-Host "Email: janekamunge4@gmail.com" -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth-v2/login" -Method Post -Body $body -Headers $headers
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "User ID: $($response.user._id)" -ForegroundColor White
    Write-Host "Name: $($response.user.name)" -ForegroundColor White
    Write-Host "Email: $($response.user.email)" -ForegroundColor White
    Write-Host "Role: $($response.user.role)" -ForegroundColor White
    Write-Host "Token received: $($response.token.Substring(0, 20))..." -ForegroundColor White
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
