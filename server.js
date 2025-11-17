import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

// Load environment variables
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Validate environment variables
console.log('Loaded ENV:');
console.log('PORT:', PORT);
console.log('MONGO_URI:', MONGO_URI ? 'OK' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'MISSING');

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      console.error(err.stack);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error('Unhandled Rejection:', err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });
