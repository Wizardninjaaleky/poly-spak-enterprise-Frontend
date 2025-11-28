
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; // Assuming this exists
import adminRoutes from './routes/adminRoutes.js'; // New admin routes
import orderRoutes from './routes/orderRoutes.js'; // New order routes
import paymentRoutes from './routes/paymentRoutes.js'; // New payment routes
import websiteRoutes from './routes/websiteRoutes.js'; // New website routes

const app = express();

// Middleware
app.use(helmet()); // Add security headers
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes); // Re-enabled admin routes
app.use('/api/orders', orderRoutes); // Add order routes
app.use('/api/payments', paymentRoutes); // Add payment routes
app.use('/api/website', websiteRoutes); // Add website routes

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

export default app;
