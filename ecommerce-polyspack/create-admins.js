import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './backend/src/models/User.js';

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/?appName=Cluster0';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdmins = async () => {
  try {
    await connectDB();

    const admins = [
      {
        name: 'Jane Mumbi',
        email: 'janekamunge4@gmail.com',
        phone: '+254700000001',
        password: 'Thamanda@2025',
        role: 'admin'
      },
      {
        name: 'Polyspack Admin',
        email: 'polyspackenterprise@gmail.com',
        phone: '+254700000000',
        password: 'Thamanda@2025',
        role: 'admin'
      }
    ];

    for (const adminData of admins) {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log(`Admin ${adminData.email} already exists`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create admin user
      const admin = await User.create({
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        passwordHash: hashedPassword,
        role: 'admin',
        addresses: [{
          street: 'Nairobi, Kenya',
          city: 'Nairobi',
          county: 'Nairobi',
          country: 'Kenya'
        }],
        isActive: true
      });

      console.log(`✅ Admin created: ${admin.email}`);
    }

    console.log('✅ All admin users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admins:', error);
    process.exit(1);
  }
};

createAdmins();
