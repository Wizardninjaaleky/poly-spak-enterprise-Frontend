const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');

const fixes = [
  { email: 'janekamunge4@gmail.com', password: 'Jane@2025' },
  { email: 'polyspackenterprise@gmail.com', password: 'Thamanda@2025' },
];

async function fix() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    for (const f of fixes) {
      const u = await User.findOne({ email: f.email });
      if (!u) {
        console.log(`User not found: ${f.email}`);
        continue;
      }
      // set plaintext so pre-save will hash once
      u.passwordHash = f.password;
      await u.save();
      console.log(`Fixed password for ${f.email}`);
    }
    await mongoose.connection.close();
    console.log('Done');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

fix();
