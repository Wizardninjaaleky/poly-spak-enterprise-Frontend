# Deployment Guide for Polyspack Enterprises E-commerce Website

## Recommended Hosting Options

### 1. Render (Recommended for Simplicity)
- **Frontend**: Deploy Next.js app as Static Site
- **Backend**: Deploy Node.js API as Web Service
- **Database**: MongoDB Atlas (free tier available)

### 2. DigitalOcean (Recommended for Control)
- **Frontend**: App Platform or Droplet with Nginx
- **Backend**: App Platform or Droplet
- **Database**: MongoDB Atlas or DigitalOcean Managed Database

### 3. AWS (Enterprise Scale)
- **Frontend**: Amplify or S3 + CloudFront
- **Backend**: EC2 or Lambda
- **Database**: DocumentDB (MongoDB-compatible)

## Deployment Steps for Render

### Backend Deployment
1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure the following settings:
   - **Name**: polyspack-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/polyspack-ecommerce
     JWT_SECRET=a1b2c3d4e5f67890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
     JWT_EXPIRE=30d
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     MPESA_CONSUMER_KEY=your-consumer-key
     MPESA_CONSUMER_SECRET=your-consumer-secret
     MPESA_SHORTCODE=174379
     MPESA_PASSKEY=your-passkey
     PAYBILL_NUMBER=522533
     ACCOUNT_NUMBER=8011202
     ```

### Frontend Deployment
1. Create a new Static Site on Render
2. Configure the following settings:
   - **Name**: polyspack-frontend
   - **Build Command**: `npm run build`
   - **Publish Directory**: `out` (for Next.js static export)
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```

### Database Setup
1. Create MongoDB Atlas account at https://cloud.mongodb.com
2. Create a free cluster
3. Set up database user and whitelist IP addresses
4. Get connection string and update MONGO_URI

## Environment Variables Setup

Create a `.env` file in both backend and frontend with the following:

### Backend .env
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/polyspack-ecommerce
JWT_SECRET=your_super_secure_jwt_secret_here
EMAIL_USER=noreply@polyspack.com
EMAIL_PASS=your_email_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=522533
MPESA_PASSKEY=your_mpesa_passkey
```

### Frontend .env.local
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Security Checklist Before Deployment

- [ ] Remove all console.log statements from production code
- [ ] Ensure all sensitive data is in environment variables
- [ ] Verify HTTPS is enabled
- [ ] Test all API endpoints
- [ ] Check CORS configuration
- [ ] Validate input sanitization
- [ ] Confirm rate limiting is active
- [ ] Test authentication flow
- [ ] Verify payment integration (use test credentials)

## Post-Deployment Steps

1. Update DNS records if using custom domain
2. Set up monitoring (Render provides basic monitoring)
3. Configure backup strategy for database
4. Set up error logging (consider services like Sentry)
5. Test the live application thoroughly
6. Update Paybill account number in payment instructions if needed

## Cost Estimation

### Render (Free Tier)
- Backend: Free (750 hours/month)
- Frontend: Free (unlimited static sites)
- Database: MongoDB Atlas free tier

### DigitalOcean
- Basic Droplet: $6/month
- App Platform: Pay per use
- Managed Database: $15/month

## Monitoring and Maintenance

- Set up uptime monitoring
- Monitor server logs for errors
- Regularly update dependencies
- Backup database weekly
- Monitor performance metrics

## Troubleshooting Common Issues

1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify MongoDB Atlas IP whitelist
3. **Environment Variables**: Ensure all required vars are set
4. **CORS Issues**: Update allowed origins in production
5. **Payment Integration**: Use sandbox credentials for testing

## Support

For deployment issues, refer to:
- Render Documentation: https://docs.render.com
- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Atlas: https://docs.atlas.mongodb.com

The application is now ready for production deployment!
