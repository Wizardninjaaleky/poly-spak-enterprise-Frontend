const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@polyspack.com' });
    if (adminExists) {
      console.log('Admin user already exists. Updating password...');
      // Hash the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Admin@12345', salt);
      adminExists.passwordHash = hashedPassword;
      await adminExists.save();
      console.log('✅ Admin password updated');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@polyspack.com',
      phone: '+254712345678',
      passwordHash: 'Admin@12345',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@12345`);
    console.log(`   Role: ${admin.role}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
