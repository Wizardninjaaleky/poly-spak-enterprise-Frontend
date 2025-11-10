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
  origin: [
    "https://poly-spak-enterprise-fronted-0sde.onrender.com" // your live frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Import your route files
try {
  app.use('/api/auth', require('./src/routes/auth'));
  app.use('/api/products', require('./src/routes/products'));
  app.use('/api/orders', require('./src/routes/orders'));
  app.use('/api/payments', require('./src/routes/payments'));
  app.use('/api/website', require('./src/routes/website'));
} catch (err) {
  console.log('⚠️ Error loading routes:', err.message);
}

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Polyspak Backend is running successfully 🚀'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running successfully`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});
