import mongoose from 'mongoose';

const connectDB = async (uri) => {
  const mongoURI = uri || process.env.MONGO_URI;
  if (!mongoURI) throw new Error('MONGODB_URI not provided');
  await mongoose.connect(mongoURI); // Use database name from URI
  console.log('MongoDB connected');
};

export default connectDB;