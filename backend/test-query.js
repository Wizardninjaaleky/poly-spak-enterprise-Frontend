import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use the actual User model schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  passwordHash: { type: String, required: true, select: false },
  role: String,
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function testQuery() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'janekamunge4@gmail.com';

    // Test the same query as the login controller
    const userWithPassword = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    
    if (!userWithPassword) {
      console.log('❌ User not found with query');
    } else {
      console.log('✅ User found!');
      console.log('Email:', userWithPassword.email);
      console.log('Has passwordHash:', !!userWithPassword.passwordHash);
      console.log('isActive:', userWithPassword.isActive);
      console.log('PasswordHash length:', userWithPassword.passwordHash ? userWithPassword.passwordHash.length : 0);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testQuery();
