const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES — FIXED
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
