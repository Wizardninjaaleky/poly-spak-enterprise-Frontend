const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');

async function inspect() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    const emails = ['janekamunge4@gmail.com', 'polyspackenterprise@gmail.com'];
    for (const email of emails) {
      const u = await User.findOne({ email });
      console.log('---');
      if (!u) {
        console.log(`User not found: ${email}`);
        continue;
      }
      console.log(`Email: ${u.email}`);
      console.log(`Name: ${u.name}`);
      console.log(`Phone: ${u.phone}`);
      console.log(`Role: ${u.role}`);
      console.log(`PasswordHash (truncated): ${u.passwordHash ? u.passwordHash.slice(0,20) + '...' : 'none'}`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

inspect();
