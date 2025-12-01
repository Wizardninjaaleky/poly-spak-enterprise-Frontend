import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const MONGO_URI = process.env.MONGO_URI;

async function testPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'janekamunge4@gmail.com';
    const password = 'Jane2024!Admin';

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found user: ${user.email}`);
    console.log(`Has passwordHash: ${!!user.passwordHash}`);
    
    if (user.passwordHash) {
      console.log(`PasswordHash: ${user.passwordHash.substring(0, 30)}...`);
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      console.log(`\nPassword match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      
      // Also test with fresh hash
      const freshHash = await bcrypt.hash(password, 10);
      const freshMatch = await bcrypt.compare(password, freshHash);
      console.log(`Fresh hash match test: ${freshMatch ? '✅ YES' : '❌ NO'}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPassword();
