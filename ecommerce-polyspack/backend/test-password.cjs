const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function testPassword() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoUri);

    // Get admin user
    const admin = await User.findOne({ email: 'admin@polyspack.com' }).select('+passwordHash');
    if (!admin) {
      console.log('Admin not found');
      await mongoose.connection.close();
      return;
    }

    console.log('Admin user found:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role: ${admin.role}`);
    console.log(`  Password Hash: ${admin.passwordHash.slice(0, 20)}...`);

    // Test password match
    const testPassword = 'Admin@12345';
    const isMatch = await admin.matchPassword(testPassword);
    console.log(`\nPassword Match Test:`);
    console.log(`  Input: ${testPassword}`);
    console.log(`  Match Result: ${isMatch}`);

    if (!isMatch) {
      // Try manual bcrypt compare
      const manualMatch = await bcrypt.compare(testPassword, admin.passwordHash);
      console.log(`  Manual bcrypt.compare: ${manualMatch}`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPassword();
