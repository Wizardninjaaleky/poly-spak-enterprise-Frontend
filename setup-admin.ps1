Write-Host "Creating Polyspack Admin User" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000/api/auth-v2"

# Default admin credentials
$adminEmail = "admin@polyspackenterprises.co.ke"
$adminPassword = "Admin@2024"

$registerBody = @{
    firstName = "Admin"
    lastName = "Polyspack"
    email = $adminEmail
    phone = "+254700000000"
    company = "Polyspack Enterprises"
    password = $adminPassword
    accountType = "business"
    agreeToMarketing = $false
} | ConvertTo-Json

Write-Host "`nCreating admin user..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    Write-Host "`nSUCCESS - Admin user created!" -ForegroundColor Green
    Write-Host "`n================================" -ForegroundColor Cyan
    Write-Host "Admin Login Credentials:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Email: $adminEmail" -ForegroundColor White
    Write-Host "Password: $adminPassword" -ForegroundColor White
    Write-Host "User ID: $($response.user._id)" -ForegroundColor Blue
    Write-Host "`nIMPORTANT: Update user role in MongoDB!" -ForegroundColor Yellow
    Write-Host "`nMongoDB Command:" -ForegroundColor Yellow
    Write-Host "db.users.updateOne({_id:ObjectId('$($response.user._id)')}, {`$set:{role:'admin'}})" -ForegroundColor White
    Write-Host "`nAdmin Login: http://localhost:3000/admin/login" -ForegroundColor Cyan
    Write-Host "================================`n" -ForegroundColor Cyan
}
catch {
    Write-Host "`nFAILED - Could not create admin user" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "already exists") {
        Write-Host "`nUser already exists. Update role in MongoDB:" -ForegroundColor Yellow
        Write-Host "db.users.updateOne({email:'$adminEmail'}, {`$set:{role:'admin'}})" -ForegroundColor White
    }
}
