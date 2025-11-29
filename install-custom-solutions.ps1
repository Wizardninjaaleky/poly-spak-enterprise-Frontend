# Custom Solutions Workflow - Installation Script
# Run this script from the project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Polyspack Custom Solutions Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install Backend Dependencies
Write-Host "[1/6] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "backend"
npm install nodemailer multer axios

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Install Frontend Dependencies
Write-Host "[2/6] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ".."
npm install framer-motion

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create Uploads Directory
Write-Host "[3/6] Creating uploads directory..." -ForegroundColor Yellow
$uploadsPath = "backend/uploads/custom-solutions"
if (-Not (Test-Path $uploadsPath)) {
    New-Item -ItemType Directory -Path $uploadsPath -Force | Out-Null
    Write-Host "✓ Uploads directory created: $uploadsPath" -ForegroundColor Green
} else {
    Write-Host "✓ Uploads directory already exists" -ForegroundColor Green
}

Write-Host ""

# Step 4: Check Environment Variables
Write-Host "[4/6] Checking environment configuration..." -ForegroundColor Yellow
$envPath = "backend/.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    $requiredVars = @(
        "EMAIL_USER",
        "EMAIL_APP_PASSWORD",
        "SALES_TEAM_EMAIL",
        "FRONTEND_URL",
        "MONGODB_URI"
    )
    
    $missingVars = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch $var) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "✓ All required environment variables are present" -ForegroundColor Green
    } else {
        Write-Host "⚠ Missing environment variables:" -ForegroundColor Yellow
        foreach ($var in $missingVars) {
            Write-Host "  - $var" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "Please add these to backend/.env file" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ No .env file found in backend directory" -ForegroundColor Yellow
    Write-Host "Creating template .env file..." -ForegroundColor Yellow
    
    $envTemplate = @"
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/polyspack?retryWrites=true&w=majority

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
SALES_TEAM_EMAIL=sales@polyspackenterprises.co.ke

# CRM Integration (Optional)
CRM_WEBHOOK_URL=https://api.hubspot.com/crm/v3/objects/contacts
CRM_API_KEY=your-hubspot-api-key

# Frontend URL
FRONTEND_URL=https://polyspackenterprises.co.ke

# Admin Dashboard URL
ADMIN_URL=https://polyspackenterprises.co.ke/admin

# Server Configuration
PORT=5000
NODE_ENV=development
"@
    
    Set-Content -Path $envPath -Value $envTemplate
    Write-Host "✓ Template .env file created" -ForegroundColor Green
    Write-Host "  Please update with your actual credentials" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Verify Files Exist
Write-Host "[5/6] Verifying installation files..." -ForegroundColor Yellow

$requiredFiles = @(
    "src/app/custom-solutions/page.jsx",
    "src/app/custom-solutions/success/page.jsx",
    "backend/src/routes/customSolutionRoutes.js",
    "backend/src/controllers/customSolutionController.js",
    "backend/src/models/CustomSolution.js",
    "backend/src/middleware/upload.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-Not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✓ All required files are present" -ForegroundColor Green
} else {
    Write-Host "✗ Missing files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# Step 6: Installation Summary
Write-Host "[6/6] Installation Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host "✓ Uploads directory created" -ForegroundColor Green
Write-Host "✓ Required files verified" -ForegroundColor Green
Write-Host ""

# Next Steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure Gmail App Password:" -ForegroundColor White
Write-Host "   - Go to https://myaccount.google.com/security" -ForegroundColor Gray
Write-Host "   - Enable 2-Step Verification" -ForegroundColor Gray
Write-Host "   - Generate App Password for 'Mail'" -ForegroundColor Gray
Write-Host "   - Update EMAIL_APP_PASSWORD in backend/.env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update Environment Variables:" -ForegroundColor White
Write-Host "   - Edit backend/.env with your credentials" -ForegroundColor Gray
Write-Host "   - Verify MONGODB_URI is correct" -ForegroundColor Gray
Write-Host "   - Update email addresses" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test Email Configuration:" -ForegroundColor White
Write-Host "   - Create backend/test-email.js (see CUSTOM_SOLUTIONS_CONFIG.md)" -ForegroundColor Gray
Write-Host "   - Run: node backend/test-email.js" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start Development Servers:" -ForegroundColor White
Write-Host "   Backend:  cd backend && npm start" -ForegroundColor Gray
Write-Host "   Frontend: npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test the Workflow:" -ForegroundColor White
Write-Host "   - Visit: http://localhost:3000/custom-solutions" -ForegroundColor Gray
Write-Host "   - Submit a test quote" -ForegroundColor Gray
Write-Host "   - Check emails were sent" -ForegroundColor Gray
Write-Host "   - Verify database storage" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Documentation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "• Configuration: CUSTOM_SOLUTIONS_CONFIG.md" -ForegroundColor Gray
Write-Host "• Testing Guide: CUSTOM_SOLUTIONS_QUICK_START.md" -ForegroundColor Gray
Write-Host "• Project Summary: PROJECT_SUMMARY.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Installation complete! 🚀" -ForegroundColor Green
Write-Host ""
