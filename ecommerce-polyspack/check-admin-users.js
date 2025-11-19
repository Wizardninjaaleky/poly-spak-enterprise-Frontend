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

const User = mongoose.model('User', userSchema);

async function checkAdminUsers() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/?appName=Cluster0';
    if (!mongoURI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check for admin users
    const adminEmails = [
      'Polyspackenterprise@gmail.com',
      'JaneKamunge4@gmail.com'
    ];

    console.log('\n🔍 Checking Admin Users:\n');

    for (const email of adminEmails) {
      const user = await User.findOne({ email }).select('name email role isActive createdAt');

      if (user) {
        console.log(`✅ Found: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Status: ${user.role === 'admin' ? '✅ CORRECT - Admin role' : '❌ INCORRECT - Not admin'}`);
      } else {
        console.log(`❌ Not Found: ${email}`);
      }
      console.log('---');
    }

    // Count total admin users
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Total Admin Users in Database: ${adminCount}`);

    // List all admin users
    if (adminCount > 0) {
      console.log('\n👥 All Admin Users:');
      const admins = await User.find({ role: 'admin' }).select('name email role');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📪 Disconnected from MongoDB');
  }
}

// Run the check
checkAdminUsers();
