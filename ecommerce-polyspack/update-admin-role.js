const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// User schema (same as in your models)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
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

// Update admin user role
const updateAdminRole = async () => {
  try {
    const adminEmail = 'polyspackenterprise@gmail.com';

    console.log('🔄 Updating admin user role...');

    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user role updated successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);

  } catch (error) {
    console.error('❌ Error updating admin role:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await updateAdminRole();
  console.log('🎉 Script completed!');
  process.exit(0);
};

main().catch(console.error);
