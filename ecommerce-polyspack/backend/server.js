const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database.js');
const app = require('./src/app.js');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📱 Frontend URL: https://polyspackenterprises.co.ke`);
  console.log(`🔗 API Base URL: ${process.env.NODE_ENV === 'production' ? 'https://your-backend-url.onrender.com' : `http://localhost:${PORT}`}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise Rejection');

  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');

  process.exit(1);
});

module.exports = server;
