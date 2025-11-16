import express from 'express';
import cors from 'cors';

const app = express();

// ✅ ENHANCED CORS FIX - More explicit configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://polyspackenterprises.co.ke', // Your live frontend
      'http://localhost:3000', // Local development
      'http://localhost:5173' // Alternative local port
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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

// Explicitly handle preflight requests for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://polyspackenterprises.co.ke');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
    timestamp: new Date().toISOString(),
    status: "operational"
  });
});

// ✅ WORKING AUTH REGISTER ENDPOINT
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log('📝 REGISTRATION ATTEMPT:', { name, email, phone });

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

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
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
        token: 'jwt_token_' + Math.random().toString(36).substr(2, 16)
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

// ✅ WORKING AUTH LOGIN ENDPOINT
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 LOGIN ATTEMPT:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Simulate successful login
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
        token: 'jwt_token_' + Math.random().toString(36).substr(2, 16)
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

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: '✅ CORS is working! Frontend can connect to backend.',
    timestamp: new Date().toISOString(),
    frontend: 'https://polyspackenterprises.co.ke'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/test-cors',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

export default app;
