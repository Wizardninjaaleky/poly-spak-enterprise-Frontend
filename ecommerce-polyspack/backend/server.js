import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📱 Frontend URL: https://poly-spak-enterprise-fronted-0sde.onrender.com`);
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

