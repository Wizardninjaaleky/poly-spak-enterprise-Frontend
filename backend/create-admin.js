import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Admin details
    const adminData = {
      firstName: 'Admin',
      lastName: 'Polyspack',
      name: 'Admin Polyspack',
      email: 'admin@polyspackenterprises.co.ke',
      phone: '+254700000000',
      company: 'Polyspack Enterprises',
      role: 'admin',
      accountType: 'business',
      isActive: true,
      isVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠ Admin user already exists!');
      console.log('Email:', adminData.email);
      process.exit(0);
    }

    // Hash password
    const password = 'Admin@2024'; // Change this!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = new User({
      ...adminData,
      passwordHash: hashedPassword,
    });

    await admin.save();

    console.log('\n✓ Admin user created successfully!');
    console.log('\n═══════════════════════════════════════');
    console.log('Admin Login Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('Email:', adminData.email);
    console.log('Password:', password);
    console.log('Role:', adminData.role);
    console.log('\n⚠ IMPORTANT: Change the password after first login!');
    console.log('\nAdmin Login URL: http://localhost:3000/admin/login');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
