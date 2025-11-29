
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; // Assuming this exists
import adminRoutes from './routes/adminRoutes.js'; // New admin routes
import orderRoutes from './routes/orderRoutes.js'; // New order routes
import paymentRoutes from './routes/paymentRoutes.js'; // New payment routes
import websiteRoutes from './routes/websiteRoutes.js'; // New website routes
import {
  apiLimiter,
  authLimiter,
  sanitizeInput,
  xssProtection,
  securityHeaders,
  requestLogger,
  secureErrorHandler
} from './middleware/security.js';

const app = express();

// Global security middleware
app.use(helmet()); // Add security headers
app.use(cors());
app.use(express.json());
app.use(sanitizeInput); // Prevent NoSQL injection
app.use(xssProtection); // Prevent XSS attacks
app.use(securityHeaders); // Additional security headers
app.use(requestLogger); // Log all requests

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limit for auth
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/admin', authLimiter, adminRoutes); // Strict rate limit for admin
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/payments', authLimiter, paymentRoutes); // Strict rate limit for payments
app.use('/api/website', apiLimiter, websiteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Polyspack API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Polyspack Enterprises API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      health: '/api/health'
    }
  });
});

// Global error handler (must be last)
app.use(secureErrorHandler);

export default app;
