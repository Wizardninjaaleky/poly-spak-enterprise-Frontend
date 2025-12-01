import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function checkIsActive() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const user = await User.findOne({ email: 'janekamunge4@gmail.com' });
    
    console.log('Email:', user.email);
    console.log('isActive field value:', user.isActive);
    console.log('isActive exists:', 'isActive' in user.toObject());
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkIsActive();
