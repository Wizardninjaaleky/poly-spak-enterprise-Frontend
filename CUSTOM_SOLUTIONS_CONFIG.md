# Custom Solutions Workflow - Environment Configuration

## Required Environment Variables

Add these variables to your `.env` file in the backend directory:

```env
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

# File Upload Settings
MAX_FILE_SIZE=10485760
MAX_FILES=5

# Server Configuration
PORT=5000
NODE_ENV=production
```

## Email Setup Instructions

### Option 1: Gmail (Recommended for Testing)

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Add to `.env` as `EMAIL_APP_PASSWORD`

### Option 2: SendGrid (Recommended for Production)

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@polyspackenterprises.co.ke
```

Update `customSolutionController.js` transporter:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

## CRM Integration Setup

### HubSpot

1. Log in to HubSpot account
2. Go to Settings → Integrations → API Key
3. Generate a private app token
4. Add to `.env` as `CRM_API_KEY`
5. Webhook URL: `https://api.hubspot.com/crm/v3/objects/contacts`

### Pipedrive

```env
CRM_WEBHOOK_URL=https://api.pipedrive.com/v1/persons
CRM_API_KEY=your-pipedrive-api-token
```

## File Upload Configuration

### Local Storage (Current Setup)

Files are saved to `backend/uploads/custom-solutions/`

### Cloudinary (Recommended for Production)

1. Install Cloudinary SDK:
```bash
npm install cloudinary
```

2. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. Update `upload.js` middleware to use Cloudinary storage

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install nodemailer multer axios
```

### 2. Register Routes in app.js

Add to `backend/src/app.js`:

```javascript
const customSolutionRoutes = require('./routes/customSolutionRoutes');

// After other routes
app.use('/api/custom-solutions', customSolutionRoutes);
```

### 3. Create Uploads Directory

```bash
mkdir -p backend/uploads/custom-solutions
```

### 4. Test Email Configuration

Create `backend/test-email.js`:

```javascript
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'your-test-email@example.com',
  subject: 'Test Email - Polyspack',
  text: 'If you receive this, email configuration is working!',
}, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
```

Run: `node backend/test-email.js`

## Frontend Configuration

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://poly-spak-enterprise-backend-2.onrender.com
```

## Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent spam

```javascript
const rateLimit = require('express-rate-limit');

const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP
  message: 'Too many quote requests. Please try again later.',
});

router.post('/', quoteLimiter, upload.array('files', 5), createQuoteRequest);
```

2. **Input Validation**: Add validation middleware

```bash
npm install joi
```

3. **CORS Configuration**: Update CORS settings in app.js

```javascript
app.use(cors({
  origin: 'https://polyspackenterprises.co.ke',
  credentials: true,
}));
```

## Testing Checklist

- [ ] Email sends to customer
- [ ] Email sends to sales team
- [ ] Files upload successfully
- [ ] Quote appears in database
- [ ] CRM webhook fires (if configured)
- [ ] Success page displays correctly
- [ ] Error handling works
- [ ] File size validation works (10MB limit)
- [ ] File type validation works (PDF, JPG, PNG, DWG, STEP only)
- [ ] Rate limiting prevents spam

## Troubleshooting

### Email Not Sending

1. Check Gmail App Password is correct (16 characters, no spaces)
2. Verify 2-Step Verification is enabled
3. Check spam folder
4. Try SendGrid as alternative

### File Upload Fails

1. Verify uploads directory exists and has write permissions
2. Check file size is under 10MB
3. Verify file type is allowed
4. Check server disk space

### CRM Integration Fails

1. Verify API key is correct
2. Check webhook URL is correct
3. Review CRM API documentation
4. Check request/response in logs

## Production Deployment

1. Set `NODE_ENV=production`
2. Use SendGrid for emails
3. Use Cloudinary for file storage
4. Enable rate limiting
5. Add monitoring (Sentry, LogRocket)
6. Set up backup email service
7. Configure SSL certificates
8. Add database backups

## Monitoring

Track these metrics:

- Quote submission rate
- Email delivery success rate
- File upload success rate
- CRM sync success rate
- Average response time
- Conversion rate (quotes → orders)
