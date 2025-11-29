# Create Admin User

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Create Polyspack Admin User          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Get admin details
Write-Host "Enter Admin Details:" -ForegroundColor Yellow
$firstName = Read-Host "First Name (default: Admin)"
if ([string]::IsNullOrWhiteSpace($firstName)) { $firstName = "Admin" }

$lastName = Read-Host "Last Name (default: Polyspack)"
if ([string]::IsNullOrWhiteSpace($lastName)) { $lastName = "Polyspack" }

$email = Read-Host "Email (default: admin@polyspackenterprises.co.ke)"
if ([string]::IsNullOrWhiteSpace($email)) { $email = "admin@polyspackenterprises.co.ke" }

$phone = Read-Host "Phone (default: +254700000000)"
if ([string]::IsNullOrWhiteSpace($phone)) { $phone = "+254700000000" }

$password = Read-Host "Password (default: Admin@2024)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
if ([string]::IsNullOrWhiteSpace($plainPassword)) { $plainPassword = "Admin@2024" }

Write-Host "`nCreating admin user..." -ForegroundColor Yellow

$baseUrl = "http://localhost:5000/api/auth-v2"

$registerBody = @{
    firstName = $firstName
    lastName = $lastName
    email = $email
    phone = $phone
    company = "Polyspack Enterprises"
    password = $plainPassword
    accountType = "business"
    agreeToMarketing = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    Write-Host "`n✓ Admin user created successfully!" -ForegroundColor Green
    Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Admin Login Credentials:" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Email: $email" -ForegroundColor White
    Write-Host "Password: $plainPassword" -ForegroundColor White
    Write-Host "User ID: $($response.user._id)" -ForegroundColor Blue
    Write-Host "`n⚠ IMPORTANT: You need to manually update the user role to 'admin' in the database!" -ForegroundColor Yellow
    Write-Host "`nRun this MongoDB command:" -ForegroundColor Yellow
    Write-Host "db.users.updateOne({email:'$email'}, {`$set:{role:'admin'}})" -ForegroundColor White
    Write-Host "`nOr use MongoDB Compass to edit the user document." -ForegroundColor Yellow
    Write-Host "`nAdmin Login URL: http://localhost:3000/admin/login" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan
} catch {
    Write-Host "`n✗ Failed to create admin user!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "already exists") {
        Write-Host "`nUser already exists. You can update their role in MongoDB:" -ForegroundColor Yellow
        Write-Host "db.users.updateOne({email:'$email'}, {`$set:{role:'admin'}})" -ForegroundColor White
    }
}
