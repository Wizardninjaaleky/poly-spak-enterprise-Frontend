import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ['customer', 'admin', 'sales', 'super_admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const adminAccounts = [
  {
    firstName: 'Jane',
    lastName: 'Mumbi',
    email: 'janekamunge4@gmail.com',
    phone: '0768756569',
    password: 'Jane2024!Admin',
    role: 'admin',
    isVerified: true,
  },
  {
    firstName: 'Gerald',
    lastName: 'Gitau',
    email: 'polyspackenterprise@gmail.com',
    phone: '0742312306',
    password: 'Gerald2024!Admin',
    role: 'admin',
    isVerified: true,
  },
];

async function createAdmins() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-connection-string';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const admin of adminAccounts) {
      const existingUser = await User.findOne({ email: admin.email });

      if (existingUser) {
        // Update existing user
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await User.updateOne(
          { email: admin.email },
          {
            $set: {
              firstName: admin.firstName,
              lastName: admin.lastName,
              phone: admin.phone,
              password: hashedPassword,
              role: admin.role,
              isVerified: true,
            },
          }
        );
        console.log(`✅ Updated admin: ${admin.email} (${admin.role})`);
      } else {
        // Create new user
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await User.create({
          ...admin,
          password: hashedPassword,
        });
        console.log(`✅ Created admin: ${admin.email} (${admin.role})`);
      }
    }

    console.log('\n🎉 All admin accounts are ready!');
    console.log('\nAdmin Credentials:');
    console.log('==================');
    adminAccounts.forEach((admin) => {
      console.log(`\n${admin.role.toUpperCase()}:`);
      console.log(`Email: ${admin.email}`);
      console.log(`Password: ${admin.password}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmins();
