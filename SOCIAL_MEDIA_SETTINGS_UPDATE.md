# Contact & Social Media Settings Update

## Summary of Changes

### 1. Updated Contact Information
✅ **Phone Number Updated Across Site**: All instances of `+254 700 000 000` replaced with `+254 742 312306`

**Files Updated:**
- `src/app/page.js` - Home page header and footer
- `src/app/products/page.jsx` - Products page header
- `src/app/cart/page.jsx` - Cart page header
- `src/app/checkout/page.jsx` - Checkout payment instructions (M-PESA, Bank Transfer, Urgent Orders)
- `src/app/track/page.jsx` - Order tracking page
- `src/app/profile/page.jsx` - User profile page
- `src/app/register/page.jsx` - Registration form placeholder
- `src/app/custom-solutions/page.jsx` - Custom solutions form
- `src/app/custom-solutions/success/page.jsx` - Success page with phone and WhatsApp links
- `backend/src/controllers/customSolutionController.js` - Email templates
- `backend/src/controllers/newAuthController.js` - Password change email
- `backend/src/services/emailService.js` - Order confirmation emails

**WhatsApp Integration:**
- Phone: +254 742 312306
- WhatsApp Link Format: `https://wa.me/254742312306`
- Direct Click-to-Chat: When users click WhatsApp icons, they are taken directly to WhatsApp with pre-filled number

### 2. Admin Dashboard - Social Media Settings Page

✅ **Created: `src/app/admin/settings/page.jsx`**
- Full admin interface for managing contact info and social media links
- Only accessible to users with 'admin' role
- Responsive design with professional UI

**Features:**
- **Contact Information Management:**
  - Contact Phone Number
  - Contact Email
  
- **Social Media Links:**
  - Facebook (with icon)
  - Instagram (with icon)
  - X/Twitter (with icon)
  - LinkedIn (with icon)
  - TikTok (with icon)
  - WhatsApp Number (special format: 254742312306 without + sign)

- **UI Features:**
  - Real-time save with loading states
  - Success/error message notifications
  - Social media platform icons
  - Validation hints for WhatsApp number format
  - Back to dashboard button
  - Logout button

**Access:** `http://localhost:3000/admin/settings`

### 3. Backend API - Settings Management

✅ **Created: `backend/src/controllers/settingsController.js`**
- GET `/api/settings` - Fetch current settings (public)
- POST `/api/settings` - Update settings (admin only)

✅ **Created: `backend/src/routes/settingsRoutes.js`**
- Routes for settings CRUD operations
- Admin authentication middleware applied

✅ **Updated: `backend/src/app.js`**
- Added settings routes: `app.use('/api/settings', settingsRoutes)`

✅ **Updated: `backend/src/models/WebsiteSettings.js`**
- Added `tiktok` field to socialMedia
- Added `whatsapp` field to socialMedia (default: '254742312306')
- Updated default phone to '+254 742 312306'

### 4. Email Notifications System

✅ **Registration Welcome Email**
- Automatically sent when user registers
- Includes account details, welcome message, and quick start guide
- Professional HTML template with company branding

✅ **Login Notification Email**
- Sent when user successfully logs in
- Includes login timestamp and security notice
- Contact information if login wasn't authorized

✅ **Order Confirmation Email**
- **Created: `backend/src/services/emailService.js`**
- `sendOrderConfirmationEmail()` - Sends to customer
- `sendOrderNotificationToAdmin()` - Sends to admin

**Order Email Features:**
- Order number and date
- Complete item list with quantities and prices
- Total amount
- Delivery address
- Order tracking link
- Contact information (phone, email, WhatsApp)
- Professional HTML template

**Implementation in Order Controller:**
```javascript
// After creating order
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '../services/emailService.js';

// Send emails
await sendOrderConfirmationEmail(order, user);
await sendOrderNotificationToAdmin(order, user);
```

✅ **Updated: `backend/src/controllers/newAuthController.js`**
- Added `sendLoginNotificationEmail()` function
- Calls welcome email on registration
- Calls login notification on successful login

### 5. WhatsApp Integration Details

**Format Guidelines:**
- **Display Format:** +254 742 312306 (with spaces for readability)
- **WhatsApp API Format:** 254742312306 (no + sign, no spaces)
- **Link Format:** `https://wa.me/254742312306`

**Implementation Locations:**
1. **Frontend:** All contact sections, footers, and call-to-action buttons
2. **Email Templates:** All automated emails include WhatsApp link
3. **Admin Settings:** Separate field for WhatsApp number management

## Testing Checklist

### Admin Settings Page
- [ ] Login as admin
- [ ] Navigate to http://localhost:3000/admin/settings
- [ ] Update contact phone number
- [ ] Update contact email
- [ ] Add social media URLs (Facebook, Instagram, X, LinkedIn, TikTok)
- [ ] Set WhatsApp number (format: 254742312306)
- [ ] Click "Save Settings"
- [ ] Verify success message appears
- [ ] Refresh page and confirm settings persisted

### Email Notifications
- [ ] Register new user - Check welcome email received
- [ ] Login existing user - Check login notification received
- [ ] Create new order - Check order confirmation email sent to customer
- [ ] Check order notification sent to admin email

### WhatsApp Links
- [ ] Click WhatsApp icon on homepage
- [ ] Click WhatsApp link in email templates
- [ ] Verify opens WhatsApp with correct number (254742312306)
- [ ] Test on mobile device

### Phone Number Display
- [ ] Homepage header shows +254 742 312306
- [ ] Checkout page M-PESA instructions show correct number
- [ ] Custom solutions success page shows correct number
- [ ] All email templates show correct number

## Environment Variables Required

Add to `backend/.env`:
```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=your-app-specific-password
ADMIN_EMAIL=sales@polyspackenterprises.co.ke

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000  # Development
# FRONTEND_URL=https://polyspackenterprises.co.ke  # Production

# JWT Secret
JWT_SECRET=polyspack_secret_key_2024
```

## Database Migrations Needed

The WebsiteSettings model has been updated. If you have existing settings documents, they will automatically get the new fields with default values on next update.

No manual migration needed - MongoDB will add fields on first settings update.

## API Endpoints Summary

### Settings
- `GET /api/settings` - Get current website settings (public)
- `POST /api/settings` - Update settings (admin only, requires auth token)

### Authentication (Email-Enabled)
- `POST /api/auth-v2/register` - Register (sends welcome email)
- `POST /api/auth-v2/login` - Login (sends login notification)
- `POST /api/auth-v2/forgot-password` - Reset password (sends reset code)
- `POST /api/auth-v2/reset-password` - Confirm password reset (sends confirmation)
- `GET /api/auth-v2/me` - Get current user (protected)

## Next Steps

1. **Test all email notifications:**
   - Register test user
   - Login and verify email
   - Create test order
   - Check admin receives order notification

2. **Configure social media:**
   - Login to admin panel
   - Add all social media URLs
   - Test links from frontend

3. **Production Deployment:**
   - Update FRONTEND_URL in production .env
   - Configure email service (Gmail or SendGrid)
   - Test WhatsApp links on production domain

4. **Future Enhancements:**
   - Add email templates customization in admin
   - Add SMS notifications alongside email
   - Implement order status update emails
   - Add newsletter subscription management

## Files Created
1. `src/app/admin/settings/page.jsx` - Admin settings interface
2. `backend/src/controllers/settingsController.js` - Settings API controller
3. `backend/src/routes/settingsRoutes.js` - Settings routes
4. `backend/src/services/emailService.js` - Order email service

## Files Modified
- `backend/src/app.js` - Added settings routes
- `backend/src/models/WebsiteSettings.js` - Added TikTok and WhatsApp fields
- `backend/src/controllers/newAuthController.js` - Added login notification email
- 15+ frontend pages with updated phone numbers
- 2 backend email templates with updated contact info

## Contact Information (Updated)
- **Phone:** +254 742 312306
- **Email:** sales@polyspackenterprises.co.ke / info@polyspackenterprises.co.ke
- **WhatsApp:** https://wa.me/254742312306
