import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import the actual User model from the codebase
import User from './src/models/User.js';

const MONGO_URI = process.env.MONGO_URI;

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({});
    
    console.log('All users in database (using User model):');
    console.log('==========================================\n');
    
    for (const user of users) {
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || `${user.firstName} ${user.lastName}`}`);
      console.log(`Role: ${user.role}`);
      console.log(`isActive: ${user.isActive}`);
      console.log('---\n');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();
