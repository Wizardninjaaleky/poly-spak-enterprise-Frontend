import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function cleanupPasswordField() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Remove the old password field from all users
    const result = await User.updateMany(
      {},
      { $unset: { password: "" } }
    );
    
    console.log(`✅ Removed old password field from ${result.modifiedCount} users\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupPasswordField();
