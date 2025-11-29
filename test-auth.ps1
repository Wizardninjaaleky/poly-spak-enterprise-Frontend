# Test authentication system

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Polyspack Authentication Tests       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

$email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$baseUrl = "http://localhost:5000/api/auth-v2"

# Test 1: Register
Write-Host "TEST 1: Register User" -ForegroundColor Yellow
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
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
    Write-Host "  Email: $($response.user.email)" -ForegroundColor Blue
    $token = $response.token
} catch {
    Write-Host "✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login
Write-Host "`nTEST 2: Login" -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = "TestPass123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
    $token = $response.token
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Current User
Write-Host "`nTEST 3: Get Current User" -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $response = Invoke-RestMethod -Uri "$baseUrl/me" -Method Get -Headers $headers
    Write-Host "✓ Got user data!" -ForegroundColor Green
    Write-Host "  Name: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Blue
    Write-Host "  Account Type: $($response.user.accountType)" -ForegroundColor Blue
} catch {
    Write-Host "✗ Failed to get user: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Forgot Password
Write-Host "`nTEST 4: Forgot Password" -ForegroundColor Yellow
$forgotBody = @{
    email = $email
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/forgot-password" -Method Post -Body $forgotBody -ContentType "application/json"
    Write-Host "✓ Reset code sent!" -ForegroundColor Green
    Write-Host "  Message: $($response.message)" -ForegroundColor Blue
} catch {
    Write-Host "✗ Forgot password failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Tests Complete               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan
