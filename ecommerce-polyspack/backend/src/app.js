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

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Polyspack Enterprise Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/test',
      auth: '/api/auth',
      admin: '/api/admin',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      website: '/api/website'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route working!',
    timestamp: new Date().toISOString(),
    server: 'Polyspack Backend API v1.0.0'
  });
});

// API Routes - Mount AFTER root routes
import auth from './routes/auth.js';
app.use('/api/auth', auth);

import admin from './routes/admin.js';
app.use('/api/admin', admin);

import products from './routes/products.js';
app.use('/api/products', products);

import orders from './routes/orders.js';
app.use('/api/orders', orders);

import payments from './routes/payments.js';
app.use('/api/payments', payments);

import website from './routes/website.js';
app.use('/api/website', website);

// 404 handler for undefined routes - MUST be last
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /test',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/products',
      'GET /api/orders',
      'POST /api/payments',
      'GET /api/admin',
      'GET /api/website/settings'
    ]
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
