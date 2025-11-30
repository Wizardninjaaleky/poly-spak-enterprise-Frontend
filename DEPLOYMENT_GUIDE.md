# Deployment Guide

## Backend Deployment (Render)

Your backend is deployed at: `https://poly-spak-enterprise-backend-2.onrender.com`

### Render Settings (Already Updated):
- **Build Command**: `npm install --prefix backend`
- **Start Command**: `npm start --prefix backend`

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Import Project"
3. Select your repository: `Wizardninjaaleky/polyspack-admin-dashboard`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://poly-spak-enterprise-backend-2.onrender.com`

6. Click "Deploy"

### Option 2: Render (Frontend)

1. Create a new Web Service on Render
2. Connect repository: `Wizardninjaaleky/polyspack-admin-dashboard`
3. Settings:
   - **Name**: `polyspack-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:frontend`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: `https://poly-spak-enterprise-backend-2.onrender.com`

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize
4. Choose: `Wizardninjaaleky/polyspack-admin-dashboard`
5. Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: `https://poly-spak-enterprise-backend-2.onrender.com`

6. Click "Deploy site"

## Testing After Deployment

1. **Test Backend**:
   ```bash
   curl https://poly-spak-enterprise-backend-2.onrender.com/api/health
   ```

2. **Test Frontend**:
   - Visit your deployed URL
   - Try logging in as admin: `polyspackenterprise@gmail.com`
   - Password: `Polyspack2024!Admin`

3. **Test User Registration**:
   - Go to `/register`
   - Create a new account
   - Login with the new account

## Admin Access

### Super Admin:
- Email: `janekamunge4@gmail.com`
- Password: `Jane2024!Admin`

### Admin:
- Email: `polyspackenterprise@gmail.com`
- Password: `Polyspack2024!Admin`

### Sales Admin:
- Email: `admin@polyspackenterprises.co.ke`
- Password: `Gerald2024!Admin`

## Local Development

For local development, use:
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in a new terminal)
npm install
npm run dev:frontend
```

The `.env.local` file is already configured for local development with `http://localhost:5000`.

## Important Notes

- ✅ All API calls now use environment variables
- ✅ Local development uses `http://localhost:5000`
- ✅ Production uses `https://poly-spak-enterprise-backend-2.onrender.com`
- ✅ No more "Access Denied" on public URL!
