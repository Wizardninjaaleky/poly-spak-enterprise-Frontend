import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User model (simplified for this script)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{
    type: { type: String, enum: ['home', 'work'], default: 'home' },
    street: String,
    city: String,
    county: String,
    country: { type: String, default: 'Kenya' }
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to hash password
import bcrypt from 'bcryptjs';
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

async function createMultipleAdminUsers() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Admin users to create
    const adminUsers = [
      {
        name: 'Gerald Gitau',
        email: 'Polyspackenterprise@gmail.com',
        phone: '+254700000000',
        passwordHash: 'Thamanda@2025',
        role: 'admin',
        addresses: [{
          type: 'home',
          street: 'Admin Address',
          city: 'Nairobi',
          county: 'Nairobi',
          country: 'Kenya'
        }],
        isActive: true
      },
      {
        name: 'Jane Kamunge',
        email: 'JaneKamunge4@gmail.com',
        phone: '+254711111111',
        passwordHash: 'Thamanda@2025',
        role: 'admin',
        addresses: [{
          type: 'home',
          street: 'Admin Address',
          city: 'Nairobi',
          county: 'Nairobi',
          country: 'Kenya'
        }],
        isActive: true
      }
    ];

    // Remove existing users if they exist
    for (const adminUser of adminUsers) {
      const existingUser = await User.findOneAndDelete({
        email: adminUser.email
      });

      if (existingUser) {
        console.log(`🗑️  Removed existing user: ${existingUser.email}`);
      } else {
        console.log(`ℹ️  No existing user found with email: ${adminUser.email}`);
      }
    }

    // Create new admin users
    const createdUsers = [];
    for (const adminUser of adminUsers) {
      const newUser = new User(adminUser);
      await newUser.save();
      createdUsers.push(newUser);
      console.log(`✅ Created admin user: ${newUser.name} (${newUser.email})`);
    }

    console.log('\n🎉 Admin users setup complete!');
    console.log('You can now login to the admin dashboard with these credentials:');
    createdUsers.forEach(user => {
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: Thamanda@2025`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from MongoDB');
  }
}

// Run the script
createMultipleAdminUsers();
