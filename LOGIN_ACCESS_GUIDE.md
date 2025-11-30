# LOGIN & REGISTRATION ACCESS GUIDE

**Last Updated**: November 30, 2025  
**Status**: ✅ All pages functional and ready to use

---

## 🌐 APPLICATION URLS

### Frontend
- **Base URL**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Customer Access
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register

### Admin Access
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

---

## 👥 ADMIN ACCOUNTS

### 1️⃣ Super Admin - Jane Kamunge
```
Email: janekamunge4@gmail.com
Password: Jane2024!Admin
Role: super_admin
Login URL: http://localhost:3000/admin/login
```

### 2️⃣ Admin - Gerald
```
Email: admin@polyspackenterprises.co.ke
Password: Gerald2024!Admin
Role: admin
Login URL: http://localhost:3000/admin/login
```

### 3️⃣ Admin - Polyspack Enterprise
```
Email: polyspackenterprise@gmail.com
Password: Polyspack2024!Admin
Role: admin
Login URL: http://localhost:3000/admin/login
```

---

## 📝 HOW TO ACCESS

### For Customers (Regular Users)

1. **Register New Account**:
   - Visit: http://localhost:3000/register
   - Fill in your details (name, email, phone, password)
   - Click "Register"
   - You'll be automatically redirected to the products page

2. **Login Existing Account**:
   - Visit: http://localhost:3000/login
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to the products page

### For Admins (Jane & Gerald)

1. **Admin Login**:
   - Visit: http://localhost:3000/admin/login
   - Enter admin email and password (see credentials above)
   - Click "Sign In"
   - You'll be redirected to the admin dashboard

2. **Admin Dashboard Access**:
   - After login, you can access: http://localhost:3000/admin/dashboard
   - Manage products, orders, users, and settings

---

## 🔧 TECHNICAL DETAILS

### API Endpoints

**Customer Auth**:
- Register: `POST http://localhost:5000/api/auth-v2/register`
- Login: `POST http://localhost:5000/api/auth-v2/login`

**Admin Auth**:
- Login: `POST http://localhost:5000/api/auth-v2/login`
- Role check: Must be 'admin', 'super_admin', or 'sales'

### Authentication Flow

1. User submits login/register form
2. Frontend sends request to backend API
3. Backend validates credentials
4. Backend returns JWT token and user data
5. Frontend stores token in localStorage:
   - `token`: JWT authentication token
   - `user`: User object with role information
   - `userData`: Detailed user information

### Role-Based Routing

**Customer (role: 'customer')**:
- Login → `/products`
- Register → `/products`

**Admin (role: 'admin', 'super_admin', 'sales')**:
- Login → `/admin/dashboard`
- Must use admin login page: `/admin/login`

---

## 🚀 STARTING THE APPLICATION

### Backend (Port 5000)
```bash
cd backend
npm start
```

### Frontend (Port 3000)
```bash
# In root directory
npx next dev
# or
npm run dev:frontend
```

**Note**: Frontend runs on port 3000 by default.

---

## ✅ TESTING CHECKLIST

### Customer Registration
- [ ] Visit http://localhost:3000/register
- [ ] Fill in all fields (name, email, phone, password)
- [ ] Submit form
- [ ] Verify redirect to /products
- [ ] Check localStorage for token and user data

### Customer Login
- [ ] Visit http://localhost:3000/login
- [ ] Enter registered email and password
- [ ] Submit form
- [ ] Verify redirect to /products
- [ ] Check localStorage for token and user data

### Admin Login - Jane (Super Admin)
- [ ] Visit http://localhost:3000/admin/login
- [ ] Enter: janekamunge4@gmail.com
- [ ] Enter: Jane2024!Admin
- [ ] Submit form
- [ ] Verify redirect to /admin/dashboard
- [ ] Check localStorage shows role: 'super_admin'

### Admin Login - Gerald (Admin)
- [ ] Visit http://localhost:3000/admin/login
- [ ] Enter: admin@polyspackenterprises.co.ke
- [ ] Enter: Gerald2024!Admin
- [ ] Submit form
- [ ] Verify redirect to /admin/dashboard
- [ ] Check localStorage shows role: 'admin'

---

## 🐛 TROUBLESHOOTING

### Issue: "Network error. Please try again"
**Solution**: Check if backend is running on port 5000
```bash
netstat -ano | findstr :5000
cd backend
npm start
```

### Issue: "Login failed" or "Registration failed"
**Possible Causes**:
1. Backend not running
2. MongoDB connection issues
3. Invalid credentials
4. Password doesn't meet requirements

**Check**:
- Backend console for error messages
- MongoDB Atlas connection status
- Password requirements: 8+ chars, uppercase, lowercase, number

### Issue: Admin login shows "Access denied"
**Solution**: Verify user role is 'admin', 'super_admin', or 'sales'
```bash
cd backend
node create-admins.js
```

### Issue: Frontend not accessible
**Solution**: Check if Next.js is running
```bash
npx next dev
# Will use port 3001 if 3000 is occupied
```

---

## 📱 PAGE FEATURES

### Login Page (`/login`)
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Link to register page
- Error message display
- Loading state during submission
- Animated design with green theme

### Register Page (`/register`)
- Name, email, phone, password fields
- Password confirmation
- Password strength indicator
- Terms and conditions checkbox
- Link to login page
- Error message display
- Loading state during submission
- Validation for Kenyan phone numbers

### Admin Login Page (`/admin/login`)
- Email and password fields
- Show/hide password toggle
- "Remember me" checkbox
- Error message display
- Loading state during submission
- Role verification (admin/super_admin/sales only)
- Professional admin theme

---

## 🔐 SECURITY NOTES

1. **Passwords**: All passwords are hashed with bcrypt (10 salt rounds)
2. **JWT Tokens**: Valid for 7 days
3. **HTTPS**: Use HTTPS in production
4. **Password Requirements**: 
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
5. **Phone Validation**: Kenyan format (+254 or 0 prefix)

---

## 📞 SUPPORT

For issues or questions:
- **Email**: polyspackenterprise@gmail.com
- **Phone**: +254 742 312306
- **WhatsApp**: https://wa.me/254742312306

---

## 📋 RECENT CHANGES

**Latest Update** (November 30, 2025):
- ✅ Fixed login page API endpoint (localhost:5000)
- ✅ Fixed register page payload structure
- ✅ Added super_admin role support
- ✅ Created admin accounts for Jane and Gerald
- ✅ Updated all auth pages to use correct API
- ✅ Verified MongoDB connection
- ✅ Tested admin login flow

**Previous Updates**:
- Added 24/7 availability indicators
- Implemented interactive animations
- Enhanced UI with Fusion-inspired design
- Added email notifications for login/registration
