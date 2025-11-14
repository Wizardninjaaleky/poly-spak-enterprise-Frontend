import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Don't exit in production, let the app handle gracefully
    if (process.env.NODE_ENV === 'production') {
      console.error('Continuing without database connection in production');
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
