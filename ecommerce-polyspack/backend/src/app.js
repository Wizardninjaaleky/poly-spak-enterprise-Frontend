const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const products = require('./routes/products');
const orders = require('./routes/orders');
const payments = require('./routes/payments');
const website = require('./routes/website');

// Security middleware
const securityMiddleware = require('./middleware/security');

const app = express();

// Apply security middleware
securityMiddleware(app);

// CORS configuration
app.use(cors({
  origin: "https://poly-spak-enterprise-fronted-0sde.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payments', payments);
app.use('/api/website', website);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Polyspack API is running' });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;
