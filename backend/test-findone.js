import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import the actual User model
import User from './src/models/User.js';

const MONGO_URI = process.env.MONGO_URI;

async function testFindOne() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'janekamunge4@gmail.com';
    console.log(`Testing: User.findOne({ email: '${email}'.toLowerCase() }).select('+passwordHash')\n`);

    // Exact query from login controller
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    
    if (user) {
      console.log('✅ User FOUND!');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Has passwordHash:', !!user.passwordHash);
      console.log('PasswordHash length:', user.passwordHash ? user.passwordHash.length : 0);
    } else {
      console.log('❌ User NOT FOUND!');
      
      // Try without toLowerCase
      const user2 = await User.findOne({ email: email });
      console.log('\nTrying without toLowerCase:', !!user2 ? 'FOUND' : 'NOT FOUND');
      
      // Try case-insensitive regex
      const user3 = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      console.log('Trying with case-insensitive regex:', !!user3 ? 'FOUND' : 'NOT FOUND');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testFindOne();
