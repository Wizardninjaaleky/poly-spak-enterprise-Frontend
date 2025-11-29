# Implementation Dependencies & Installation Guide

## Required NPM Packages

### Install All Dependencies at Once

```bash
npm install react-hook-form @hookform/resolvers zod framer-motion nodemailer @strapi/strapi cloudinary multer sharp
```

### Development Dependencies

```bash
npm install -D @types/node @types/react @types/react-dom eslint-plugin-jsx-a11y
```

---

## Individual Package Purposes

### Form Management
```json
{
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4"
}
```
**Purpose**: Advanced form handling with validation for contact forms, quote calculator, sample requests

### Animation
```json
{
  "framer-motion": "^10.16.5"
}
```
**Purpose**: Smooth animations for quote calculator steps, modals, page transitions

### Email Service
```json
{
  "nodemailer": "^6.9.7"
}
```
**Purpose**: Send contact form emails, order confirmations, quote notifications

### Image Optimization
```json
{
  "cloudinary": "^1.41.0",
  "sharp": "^0.33.0",
  "multer": "^1.4.5-lts.1"
}
```
**Purpose**: Cloud image hosting, automatic optimization, file uploads

### CMS Integration (Optional - if using Strapi)
```json
{
  "@strapi/strapi": "^4.15.5"
}
```
**Purpose**: Headless CMS for blog and content management

### Search & Filtering (Optional - Advanced)
```json
{
  "algoliasearch": "^4.20.0",
  "meilisearch": "^0.37.0"
}
```
**Purpose**: Fast product search with autocomplete

### Analytics
```json
{
  "@vercel/analytics": "^1.1.1",
  "@sentry/nextjs": "^7.84.0"
}
```
**Purpose**: Performance monitoring and error tracking

---

## Updated package.json

Add these to your existing `package.json`:

```json
{
  "name": "polyspack-enterprises",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@reduxjs/toolkit": "^2.0.1",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.0",
    "framer-motion": "^10.16.5",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "next": "14.2.4",
    "nodemailer": "^6.9.7",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.48.0",
    "react-redux": "^9.0.4",
    "sharp": "^0.33.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@babel/core": "^7.23.6",
    "@babel/preset-env": "^7.23.6",
    "@babel/preset-react": "^7.23.3",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8",
    "eslint-config-next": "14.2.4",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
```

---

## Backend Dependencies (backend/package.json)

For the Express backend, add these:

```json
{
  "dependencies": {
    "cloudinary": "^1.41.0",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "nodemailer": "^6.9.7",
    "sharp": "^0.33.0",
    "@sendgrid/mail": "^7.7.0"
  }
}
```

---

## Environment Variables to Add

Update your `.env.local`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
CONTACT_EMAIL=info@polyspackenterprises.co.ke
QUOTES_EMAIL=quotes@polyspackenterprises.co.ke

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# CMS (if using Strapi)
NEXT_PUBLIC_STRAPI_URL=https://cms.polyspackenterprises.co.ke
STRAPI_API_TOKEN=your_strapi_api_token

# Search (if using Algolia)
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

---

## Installation Steps

### 1. Install Frontend Dependencies

```powershell
cd "C:\Users\user\OneDrive\Documents\Ecommerce fertilizers"
npm install react-hook-form @hookform/resolvers zod framer-motion nodemailer cloudinary multer sharp
npm install -D @types/node @types/react @types/react-dom eslint-plugin-jsx-a11y
```

### 2. Install Backend Dependencies

```powershell
cd backend
npm install cloudinary multer multer-storage-cloudinary nodemailer sharp @sendgrid/mail
```

### 3. Configure Email Service

**Option A: Gmail** (for development)
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Use app password in `SMTP_PASS`

**Option B: SendGrid** (for production)
1. Sign up at https://sendgrid.com
2. Create API key
3. Verify sender email
4. Use SendGrid instead of nodemailer:

```javascript
// backend/src/services/email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, html }) {
  const msg = {
    to,
    from: 'noreply@polyspackenterprises.co.ke',
    subject,
    html
  };
  
  return sgMail.send(msg);
}
```

### 4. Configure Cloudinary

1. Sign up at https://cloudinary.com (free tier: 25GB storage, 25GB bandwidth)
2. Get credentials from dashboard
3. Add to `.env.local`

```javascript
// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(file, folder = 'polyspack') {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataURI = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    resource_type: 'auto',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  });

  return result.secure_url;
}

export default cloudinary;
```

### 5. Set Up Google Analytics

1. Go to https://analytics.google.com
2. Create property for polyspackenterprises.co.ke
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to `.env.local`

### 6. Set Up Google Tag Manager (Optional)

1. Go to https://tagmanager.google.com
2. Create container
3. Get Container ID (GTM-XXXXXXX)
4. Add to `.env.local`

---

## Verification Commands

After installation, verify everything works:

```powershell
# Check dependencies
npm list react-hook-form zod framer-motion nodemailer cloudinary

# Test build
npm run build

# Check for security vulnerabilities
npm audit

# Run development server
npm run dev
```

---

## Optional: Performance Monitoring Setup

### Vercel Analytics (Easiest)

```bash
npm install @vercel/analytics
```

```javascript
// src/app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Follow wizard to configure Sentry.

---

## CMS Setup Options

### Option 1: Strapi (Self-hosted)

```bash
# Create Strapi project
npx create-strapi-app@latest cms --quickstart

# Configure
cd cms
npm run develop
```

### Option 2: Sanity (Cloud-hosted)

```bash
npm install @sanity/client next-sanity
npx sanity init
```

### Option 3: Contentful (Cloud-hosted)

```bash
npm install contentful
```

---

## Testing Checklist

After installing dependencies:

- [ ] Forms validate correctly with zod
- [ ] Animations work smoothly with framer-motion
- [ ] Email sending works (test contact form)
- [ ] Images upload to Cloudinary
- [ ] Google Analytics tracking events
- [ ] Build succeeds without errors
- [ ] No console errors in browser
- [ ] Mobile responsiveness maintained

---

## Troubleshooting

### Issue: Sharp installation fails on Windows

**Solution:**
```powershell
npm install --platform=win32 --arch=x64 sharp
```

### Issue: Nodemailer connection refused

**Solution:**
- Use App Password for Gmail, not regular password
- Check SMTP_PORT (465 for SSL, 587 for TLS)
- Verify firewall settings

### Issue: Cloudinary upload fails

**Solution:**
- Verify environment variables are correct
- Check file size limits (10MB default)
- Ensure cloud_name doesn't have typos

### Issue: Framer Motion animations choppy

**Solution:**
```javascript
// Use GPU acceleration
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

---

## Production Optimization

Before deploying to production:

```powershell
# Remove unused dependencies
npm prune --production

# Optimize images
npx next-unused

# Check bundle size
npm run build
npm run analyze
```

---

**Total Installation Time**: ~15 minutes  
**Disk Space Required**: ~500MB (node_modules)  
**Internet Required**: Yes (for package downloads)
