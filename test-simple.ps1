Write-Host "Testing Polyspack Authentication" -ForegroundColor Cyan

$email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$baseUrl = "http://localhost:5000/api/auth-v2"

# Test Register
Write-Host "`nTEST 1: Register User" -ForegroundColor Yellow
$registerBody = @{
    firstName = "John"
    lastName = "Doe"
    email = $email
    phone = "+254712345678"
    company = "Test Company"
    password = "TestPass123"
    accountType = "business"
    agreeToMarketing = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "SUCCESS - Registration worked!" -ForegroundColor Green
    Write-Host "User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
    Write-Host "Email: $($response.user.email)" -ForegroundColor Blue
    $token = $response.token
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test Login
Write-Host "`nTEST 2: Login" -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = "TestPass123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "SUCCESS - Login worked!" -ForegroundColor Green
    Write-Host "User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
    $token = $response.token
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test Get Current User
Write-Host "`nTEST 3: Get Current User" -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $response = Invoke-RestMethod -Uri "$baseUrl/me" -Method Get -Headers $headers
    Write-Host "SUCCESS - Got user data!" -ForegroundColor Green
    Write-Host "Name: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll tests complete!" -ForegroundColor Cyan
