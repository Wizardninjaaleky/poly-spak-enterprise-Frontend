import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('✅ app.js is loading...');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://poly-spak-enterprise-fronted-0sde.onrender.com', // Production frontend
    'https://your-frontend-domain.vercel.app' // If using Vercel
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - THIS IS WHAT'S MISSING
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Poly Spark Enterprise Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working!',
    timestamp: new Date().toISOString()
  });
});



// Add your other routes here when ready
import auth from './routes/auth.js';
app.use('/api/auth', auth);

// Import and use admin routes
import admin from './routes/admin.js';
app.use('/api/admin', admin);

// Import and use product routes
import products from './routes/products.js';
app.use('/api', products);

// Import and use order routes
import orders from './routes/orders.js';
app.use('/api', orders);

// Import and use payment routes
import payments from './routes/payments.js';
app.use('/api', payments);

// Import and use website routes
import website from './routes/website.js';
app.use('/api', website);

// app.use('/api/users', userRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

export default app;
