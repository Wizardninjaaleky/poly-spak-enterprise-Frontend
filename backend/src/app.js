
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import newAuthRoutes from './routes/newAuthRoutes.js'; // New authentication system
import productRoutes from './routes/productRoutes.js'; // Assuming this exists
import adminRoutes from './routes/adminRoutes.js'; // New admin routes
import orderRoutes from './routes/orderRoutes.js'; // New order routes
import paymentRoutes from './routes/paymentRoutes.js'; // New payment routes
import mpesaRoutes from './routes/mpesaRoutes.js'; // M-PESA STK Push integration
import websiteRoutes from './routes/websiteRoutes.js'; // New website routes
import customSolutionRoutes from './routes/customSolutionRoutes.js'; // Custom solutions workflow
import settingsRoutes from './routes/settingsRoutes.js'; // Website settings
import heroSlideRoutes from './routes/heroSlideRoutes.js'; // Hero slides management
import profileRoutes from './routes/profileRoutes.js'; // User profile management
import {
  apiLimiter,
  authLimiter,
  sanitizeInput,
  xssProtection,
  securityHeaders,
  requestLogger,
  secureErrorHandler
} from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Global security middleware
app.use(helmet()); // Add security headers
app.use(cors());
app.use(express.json());
app.use(sanitizeInput); // Prevent NoSQL injection
app.use(xssProtection); // Prevent XSS attacks
app.use(securityHeaders); // Additional security headers
app.use(requestLogger); // Log all requests

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limit for auth
app.use('/api/auth-v2', authLimiter, newAuthRoutes); // New authentication system with email/phone
app.use('/api/products', apiLimiter, productRoutes);
app.use('/api/admin', authLimiter, adminRoutes); // Strict rate limit for admin
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/payments', authLimiter, paymentRoutes); // Strict rate limit for payments
app.use('/api/payments/mpesa', authLimiter, mpesaRoutes); // M-PESA STK Push integration
app.use('/api/website', apiLimiter, websiteRoutes);
app.use('/api/custom-solutions', authLimiter, customSolutionRoutes); // Custom solutions with strict rate limit
app.use('/api/settings', settingsRoutes); // Website settings management
app.use('/api/hero-slides', heroSlideRoutes); // Hero slides management
app.use('/api/profile', apiLimiter, profileRoutes); // User profile management

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
