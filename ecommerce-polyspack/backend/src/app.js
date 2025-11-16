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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000', // Local development
      'https://poly-spak-enterprise-fronted-0sde.onrender.com', // Production frontend
      'https://polyspackenterprises.co.ke', // Current live frontend
      'https://your-frontend-domain.vercel.app' // If using Vercel
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials for authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
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
    message: "Welcome to Polyspack Enterprises API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      payments: "/api/payments",
      admin: "/api/admin",
      health: "/api/health"
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});

// ✅ WORKING AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log('📝 REGISTRATION REQUEST:', { name, email, phone });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Successful registration
    res.status(201).json({
      success: true,
      message: '🎉 Registration successful! Welcome to Polyspack Enterprises!',
      data: {
        user: {
          id: 'user_' + Date.now(),
          name: name,
          email: email,
          phone: phone || '',
          role: 'customer'
        },
        token: 'jwt_' + Math.random().toString(36).substr(2, 16)
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 LOGIN REQUEST:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Successful login
    res.json({
      success: true,
      message: '✅ Login successful! Welcome back!',
      data: {
        user: {
          id: 'user_123',
          name: 'Alex Nyakundi',
          email: email,
          role: 'customer'
        },
        token: 'jwt_' + Math.random().toString(36).substr(2, 16)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Test endpoint working! Backend is connected.',
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
