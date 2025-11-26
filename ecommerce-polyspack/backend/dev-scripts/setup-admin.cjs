const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');

async function setupAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoUri);

    // Delete existing admin
    await User.deleteOne({ email: 'admin@polyspack.com' });
    console.log('Old admin deleted');

    // Hash password manually
    const plainPassword = 'Admin@12345';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log(`Password hashed (salt: 10)`);

    // Create new admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@polyspack.com',
      phone: '+254712345678',
      passwordHash: hashedPassword,
      role: 'admin',
    });

    await admin.save({ validateBeforeSave: false }); // Skip pre-save middleware
    console.log('✅ Admin created with pre-hashed password');

    // Verify password works
    const fetchedAdmin = await User.findOne({ email: 'admin@polyspack.com' }).select('+passwordHash');
    const isMatch = await bcrypt.compare(plainPassword, fetchedAdmin.passwordHash);
    console.log(`✅ Password verification: ${isMatch}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupAdmin();
