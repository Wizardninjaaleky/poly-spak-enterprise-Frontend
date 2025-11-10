const express = require('express');
const connectDB = require('./src/config/database');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://poly-spak-enterprise-fronted-0sde.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Load routes
try {
  app.use('/api/auth', require('./src/routes/auth'));
  app.use('/api/products', require('./src/routes/products'));
  app.use('/api/orders', require('./src/routes/orders'));
  app.use('/api/payments', require('./src/routes/payments'));
  app.use('/api/website', require('./src/routes/website'));
} catch (err) {
  console.log('Error loading routes:', err.message);
}

// Default route - must be before catch-all
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running'
  });
});

// Handle undefined routes - must be last
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

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
