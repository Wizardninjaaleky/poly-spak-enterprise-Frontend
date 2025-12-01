import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function setIsActive() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Set isActive to true for all admin users
    const result = await User.updateMany(
      { role: 'admin' },
      { $set: { isActive: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} admin users with isActive: true\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setIsActive();
