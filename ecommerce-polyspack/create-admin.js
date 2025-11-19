import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/src/models/User.js';

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/?appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'polyspackenterprise@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Polyspack Admin',
      email: 'polyspackenterprise@gmail.com',
      phone: '+254700000000',
      passwordHash: 'Thamanda@2025', // Will be hashed by pre-save middleware
      role: 'admin',
      addresses: [{
        street: 'Nairobi, Kenya',
        city: 'Nairobi',
        county: 'Nairobi',
        country: 'Kenya'
      }],
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: polyspackenterprise@gmail.com');
    console.log('Password: Thamanda@2025');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
