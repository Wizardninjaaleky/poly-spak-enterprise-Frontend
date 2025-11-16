import express from 'express';
import cors from 'cors';

const app = express();

// ✅ ALLOW ALL ORIGINS - NO BLOCKING
app.use(cors({
  origin: '*', // Allow EVERYTHING
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Polyspack Enterprises API",
    version: "1.0.0"
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    message: "Polyspack API is running"
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: "Registration successful!",
    user: { id: 1, name: req.body.name, email: req.body.email },
    token: "jwt-token-123"
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: "Login successful!",
    user: { id: 1, name: "Test User", email: req.body.email },
    token: "jwt-token-123"
  });
});

// Test CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: "✅ CORS IS WORKING!",
    timestamp: new Date().toISOString()
  });
});

export default app;
