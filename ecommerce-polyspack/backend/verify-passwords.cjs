const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/models/User');

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
  await mongoose.connect(mongoUri);
  const tests = [
    { email: 'janekamunge4@gmail.com', password: 'Jane@2025' },
    { email: 'polyspackenterprise@gmail.com', password: 'Thamanda@2025' },
  ];
  for (const t of tests) {
    const user = await User.findOne({ email: t.email });
    if (!user) {
      console.log(`${t.email} not found`);
      continue;
    }
    const match = await bcrypt.compare(t.password, user.passwordHash);
      console.log(`${t.email} password match: ${match}`);
      console.log(`  stored hash: ${user.passwordHash}`);
  }
    // sanity check: create a fresh hash and compare
    const sample = 'Jane@2025';
    const sampleHash = await bcrypt.hash(sample, 12);
    const ok = await bcrypt.compare(sample, sampleHash);
    console.log('Sanity check compare (should be true):', ok);
  await mongoose.connection.close();
}

run().catch(e=>{console.error(e);process.exit(1)});
