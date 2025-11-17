import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  if (!uri) throw new Error('Missing MONGO_URI');
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
