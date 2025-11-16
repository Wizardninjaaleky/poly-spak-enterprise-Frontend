import express from 'express';
import cors from 'cors';

const app = express();

// ✅ URGENT CORS FIX - Allow your frontend domain
app.use(cors({
  origin: 'https://polyspackenterprises.co.ke',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

app.use(express.json());

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
    status: "OK",
    message: "Polyspack API is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ ADD AUTH ENDPOINTS (if missing)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log('📝 REGISTRATION:', { name, email });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Success
    res.json({
      success: true,
      message: '🎉 Registration successful!',
      data: {
        user: {
          id: 'user_' + Date.now(),
          name: name,
          email: email,
          phone: phone
        },
        token: 'jwt_token_123'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 LOGIN:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    // Success
    res.json({
      success: true,
      message: '✅ Login successful!',
      data: {
        user: {
          id: 'user_123',
          name: 'Alex Nyakundi',
          email: email
        },
        token: 'jwt_token_123'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default app;
