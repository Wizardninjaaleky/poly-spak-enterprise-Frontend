# ADMIN LOGIN CREDENTIALS

## Access URL
**Admin Portal:** http://localhost:3000/admin

## Admin Account 1 - Jane Mumbi
- **Email:** `janekamunge4@gmail.com`
- **Password:** `Jane2024!Admin`
- **Role:** Admin

## Admin Account 2 - Gerald Gitau  
- **Email:** `polyspackenterprise@gmail.com`
- **Password:** `Gerald2024!Admin`
- **Role:** Admin

## Login Instructions
1. Navigate to http://localhost:3000/admin in your browser
2. Enter one of the email addresses listed above
3. Enter the corresponding password
4. Click "Sign In" or press Enter
5. You will be redirected to the admin dashboard

## API Endpoint
If testing via API:
- **Login Endpoint:** `POST http://localhost:5000/api/auth-v2/login`
- **Request Body:**
  ```json
  {
    "email": "janekamunge4@gmail.com",
    "password": "Jane2024!Admin"
  }
  ```

## Test Status
✅ Backend server running on port 5000
✅ Frontend server running on port 3000
✅ MongoDB connected successfully
✅ Both admin accounts verified and active
✅ Password authentication tested and working
