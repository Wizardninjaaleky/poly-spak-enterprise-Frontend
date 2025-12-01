import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const admin = await User.findOne({ email: 'janekamunge4@gmail.com' });
    
    if (admin) {
      console.log('\n═══════════════════════════════════════');
      console.log('Admin User Found:');
      console.log('═══════════════════════════════════════');
      console.log('Email:', admin.email);
      console.log('Name:', admin.name);
      console.log('Role:', admin.role);
      console.log('Account Type:', admin.accountType);
      console.log('Is Active:', admin.isActive);
      console.log('Is Verified:', admin.isVerified);
      console.log('═══════════════════════════════════════\n');
      
      if (admin.role !== 'admin') {
        console.log('⚠️  WARNING: User role is NOT "admin"');
        console.log('   Current role:', admin.role);
        console.log('   Updating to "admin"...\n');
        
        admin.role = 'admin';
        await admin.save();
        console.log('✓ Role updated to "admin"');
      } else {
        console.log('✓ Role is correctly set to "admin"');
      }
    } else {
      console.log('✗ Admin user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

checkAdmin();
