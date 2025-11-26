const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');

const admins = [
  {
    name: 'Jane mumbi',
    email: 'janekamunge4@gmail.com',
    phone: '0768756569',
    password: 'Jane@2025',
  },
  {
    name: 'gerald gitau',
    email: 'polyspackenterprise@gmail.com',
    phone: '0742312306',
    password: 'Thamanda@2025',
  },
];

async function upsertAdmins() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const a of admins) {
      const hashed = await bcrypt.hash(a.password, 12);
      const email = a.email.toLowerCase();

      const existing = await User.findOne({ email });
      if (existing) {
        existing.name = a.name;
        existing.phone = a.phone;
        existing.role = 'admin';
        existing.passwordHash = hashed;
        await existing.save();
        console.log(`Updated admin: ${email}`);
      } else {
        await User.create({
          name: a.name,
          email,
          phone: a.phone,
          passwordHash: hashed,
          role: 'admin',
        });
        console.log(`Created admin: ${email}`);
      }
    }

    await mongoose.connection.close();
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

upsertAdmins();
