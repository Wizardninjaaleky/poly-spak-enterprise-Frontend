# Polyspack Admin Panel Setup Guide

## Admin Access Overview

The Polyspack admin panel provides secure access for administrators and sales staff to manage the e-commerce platform.

## 🔐 Admin Login

**URL:** `http://localhost:3000/admin/login` (Production: `https://yourdomain.com/admin/login`)

### Features:
- Secure authentication with JWT tokens
- Role-based access (admin & sales roles)
- Session management
- Password reset functionality
- Activity logging

## 🚀 Creating the First Admin User

### Option 1: Using PowerShell Script (Recommended)

1. **Ensure backend server is running:**
   ```powershell
   cd backend
   npm start
   ```

2. **Run the admin creation script:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File create-admin.ps1
   ```

3. **Follow the prompts** to enter admin details or use defaults:
   - Email: `admin@polyspackenterprises.co.ke`
   - Password: `Admin@2024`

4. **Update user role in MongoDB:**
   
   After the user is created, you need to manually set their role to 'admin':
   
   **Using MongoDB Compass:**
   - Open MongoDB Compass
   - Connect to your database
   - Navigate to `polyspack-ecommerce` database → `users` collection
   - Find the user with your admin email
   - Edit the document and set `role: "admin"`
   - Save changes

   **Using MongoDB Shell:**
   ```javascript
   db.users.updateOne(
     { email: "admin@polyspackenterprises.co.ke" },
     { $set: { role: "admin" } }
   )
   ```

### Option 2: Using Node.js Script

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Run the script:**
   ```powershell
   node create-admin.js
   ```

3. **Note the credentials** displayed in the console

## 📋 Admin User Management

### Creating Additional Admin Users

**Method 1: Through Admin Panel (Future Feature)**
- Navigate to Users section
- Click "Add Admin User"
- Fill in details and assign role

**Method 2: Promote Existing User**

Using MongoDB:
```javascript
// Promote user to admin
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)

// Promote user to sales
db.users.updateOne(
  { email: "sales@example.com" },
  { $set: { role: "sales" } }
)
```

### User Roles

| Role | Access Level | Permissions |
|------|-------------|-------------|
| `admin` | Full Access | All features, user management, site settings |
| `sales` | Limited Access | Orders, products, customer management |
| `customer` | No Admin Access | Frontend shopping only |

## 🎯 Admin Dashboard Features

### Current Features:
- **Dashboard Overview**
  - Total orders statistics
  - Pending orders count
  - User metrics
  - Revenue tracking

- **Quick Actions**
  - Manage Orders
  - Product Management
  - User Management
  - Site Settings

- **Recent Activity Feed**
  - New orders
  - User registrations
  - Quote requests

### Planned Features:
- Order management interface
- Product catalog editor
- User management panel
- Analytics and reports
- Site content editor
- Email template editor
- Custom solutions management

## 🔒 Security Features

1. **Authentication:**
   - JWT token-based authentication
   - 7-day token expiry
   - Secure password hashing (bcrypt)

2. **Authorization:**
   - Role-based access control
   - Route protection
   - Action logging

3. **Session Management:**
   - Automatic logout on token expiry
   - Manual logout functionality
   - Token stored securely in localStorage

## 🛠️ Admin API Endpoints

All admin routes use the same authentication system:

```
POST   /api/auth-v2/login          - Admin login
POST   /api/auth-v2/logout         - Admin logout
GET    /api/auth-v2/me             - Get current admin user
POST   /api/auth-v2/forgot-password - Password reset request
```

## 📱 Admin Access URLs

### Development:
- Admin Login: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

### Production:
- Admin Login: `https://polyspackenterprises.co.ke/admin/login`
- Admin Dashboard: `https://polyspackenterprises.co.ke/admin/dashboard`

## 🔧 Troubleshooting

### Can't Login as Admin

**Issue:** "Access denied. Admin or sales privileges required."

**Solution:** User role is not set to 'admin' or 'sales'
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Forgot Admin Password

1. Use the forgot password flow at `/admin/login`
2. Or manually reset in database:
   ```javascript
   // Generate new password hash
   const bcrypt = require('bcryptjs');
   const newPassword = 'NewPassword123';
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(newPassword, salt);
   
   // Update in MongoDB
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { passwordHash: hash } }
   )
   ```

### Token Expired

- Simply login again - tokens expire after 7 days
- No action needed, just re-authenticate

## 📊 Best Practices

1. **Change Default Password:**
   - Always change the default admin password immediately after first login

2. **Use Strong Passwords:**
   - Minimum 8 characters
   - Include uppercase, lowercase, and numbers
   - Avoid common words

3. **Limit Admin Access:**
   - Only create admin accounts for trusted personnel
   - Use 'sales' role for staff who don't need full access

4. **Regular Audits:**
   - Review admin user list regularly
   - Deactivate accounts for former employees
   - Monitor admin activity logs

5. **Secure Environment:**
   - Always use HTTPS in production
   - Keep JWT_SECRET secure and complex
   - Enable two-factor authentication (future feature)

## 🚨 Emergency Admin Recovery

If you lose access to all admin accounts:

1. **Create new admin via database:**
   ```javascript
   // In MongoDB shell
   const bcrypt = require('bcryptjs');
   const salt = bcrypt.genSaltSync(10);
   const hash = bcrypt.hashSync('EmergencyPass123', salt);
   
   db.users.insertOne({
     firstName: "Emergency",
     lastName: "Admin",
     name: "Emergency Admin",
     email: "emergency@polyspackenterprises.co.ke",
     phone: "+254799999999",
     passwordHash: hash,
     role: "admin",
     accountType: "business",
     isActive: true,
     isVerified: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

2. **Login with emergency credentials:**
   - Email: `emergency@polyspackenterprises.co.ke`
   - Password: `EmergencyPass123`

3. **Immediately change password and create proper admin**

## 📞 Support

For technical support with admin panel access:
- Email: tech@polyspackenterprises.co.ke
- Phone: +254 700 000 000

## 🔄 Updates

**Version 1.0 (Current)**
- Basic admin login
- Dashboard overview
- Role-based access
- JWT authentication

**Planned Updates:**
- Full CRUD operations for all entities
- Advanced analytics
- Bulk operations
- Export functionality
- API documentation
- Activity logs viewer
