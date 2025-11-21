import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/src/models/User.js';

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createJaneAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'janemunge4@gmail.com' });
    if (existingAdmin) {
      console.log('Jane admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Jane Mumbi',
      email: 'janemunge4@gmail.com',
      phone: '+254768756569',
      passwordHash: 'jane@2025', // Will be hashed by pre-save middleware
      role: 'admin',
      addresses: [{
        street: 'Nairobi, Kenya',
        city: 'Nairobi',
        county: 'Nairobi',
        country: 'Kenya'
      }],
      isActive: true
    });

    console.log('✅ Jane admin user created successfully!');
    console.log('Name: Jane Mumbi');
    console.log('Email: janemunge4@gmail.com');
    console.log('Phone: +254768756569');
    console.log('Password: jane@2025');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating Jane admin user:', error);
    process.exit(1);
  }
};

createJaneAdminUser();
