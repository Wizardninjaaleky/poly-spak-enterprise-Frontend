import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: { type: String, select: false },
  password: String,
  role: String,
  isVerified: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function checkUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const admins = await User.find({ role: 'admin' }).select('+passwordHash');
    
    console.log('Admin users in database:');
    console.log('========================\n');
    
    for (const admin of admins) {
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Has passwordHash: ${!!admin.passwordHash}`);
      console.log(`Has password field: ${!!admin.password}`);
      if (admin.passwordHash) {
        console.log(`PasswordHash (first 20 chars): ${admin.passwordHash.substring(0, 20)}...`);
      }
      if (admin.password) {
        console.log(`Password field (first 20 chars): ${admin.password.substring(0, 20)}...`);
      }
      console.log('---\n');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
