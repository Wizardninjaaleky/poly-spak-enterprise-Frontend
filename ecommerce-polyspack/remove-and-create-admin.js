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

async function removeAndCreateAdmin() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Remove existing user
    const existingUser = await User.findOneAndDelete({
      email: 'polyspackenterprise@gmail.com'
    });

    if (existingUser) {
      console.log('🗑️  Removed existing user:', existingUser.email);
    } else {
      console.log('ℹ️  No existing user found with that email');
    }

    // Create new admin user
    const adminUser = new User({
      name: 'Polyspack Admin',
      email: 'polyspackenterprise@gmail.com',
      phone: '+254700000000', // Placeholder phone number
      passwordHash: 'Thamanda@2025', // Will be hashed by pre-save middleware
      role: 'admin',
      addresses: [{
        type: 'home',
        street: 'Admin Address',
        city: 'Nairobi',
        county: 'Nairobi',
        country: 'Kenya'
      }],
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Created new admin user:');
    console.log('   Email: polyspackenterprise@gmail.com');
    console.log('   Password: Thamanda@2025');
    console.log('   Role: admin');

    console.log('\n🎉 Admin user setup complete!');
    console.log('You can now login to the admin dashboard with the credentials above.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from MongoDB');
  }
}

// Run the script
removeAndCreateAdmin();
