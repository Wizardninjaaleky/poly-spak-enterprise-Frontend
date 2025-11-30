import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'super_admin', 'sales'], 
    default: 'customer' 
  },
  accountType: { type: String, enum: ['personal', 'business'], default: 'personal' },
  isVerified: { type: Boolean, default: false },
  agreeToMarketing: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmins() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const admins = [
      {
        firstName: 'Jane',
        lastName: 'Kamunge',
        name: 'Jane Kamunge',
        email: 'janekamunge4@gmail.com',
        phone: '+254742312306',
        company: 'Polyspack Enterprises',
        password: 'Jane2024!Admin',
        role: 'super_admin',
      },
      {
        firstName: 'Gerald',
        lastName: 'Admin',
        name: 'Gerald Admin',
        email: 'admin@polyspackenterprises.co.ke',
        phone: '+254700000001',
        company: 'Polyspack Enterprises',
        password: 'Gerald2024!Admin',
        role: 'admin',
      },
      {
        firstName: 'Polyspack',
        lastName: 'Enterprise',
        name: 'Polyspack Enterprise',
        email: 'polyspackenterprise@gmail.com',
        phone: '+254700000002',
        company: 'Polyspack Enterprises',
        password: 'Polyspack2024!Admin',
        role: 'admin',
      }
    ];

    for (const adminData of admins) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: adminData.email });
      
      if (existingUser) {
        console.log(`\n👤 User ${adminData.email} already exists`);
        
        let updated = false;
        
        // Update role if needed
        if (existingUser.role !== adminData.role) {
          existingUser.role = adminData.role;
          updated = true;
          console.log(`   ✅ Updated role to ${adminData.role}`);
        } else {
          console.log(`   ℹ️  Role is already ${existingUser.role}`);
        }
        
        // Update missing fields
        if (!existingUser.firstName && adminData.firstName) {
          existingUser.firstName = adminData.firstName;
          updated = true;
        }
        if (!existingUser.lastName && adminData.lastName) {
          existingUser.lastName = adminData.lastName;
          updated = true;
        }
        if (!existingUser.name && adminData.name) {
          existingUser.name = adminData.name;
          updated = true;
        }
        if (!existingUser.phone && adminData.phone) {
          existingUser.phone = adminData.phone;
          updated = true;
        }
        if (!existingUser.company && adminData.company) {
          existingUser.company = adminData.company;
          updated = true;
        }
        
        if (updated) {
          await existingUser.save();
          console.log(`   ✅ Updated user information`);
        }
        
        console.log(`   📧 Email: ${existingUser.email}`);
        console.log(`   👤 Name: ${existingUser.name}`);
        console.log(`   📱 Phone: ${existingUser.phone}`);
        console.log(`   🔑 Role: ${existingUser.role}`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create new admin user
      const newAdmin = new User({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        name: adminData.name,
        email: adminData.email.toLowerCase(),
        phone: adminData.phone,
        company: adminData.company,
        passwordHash: hashedPassword,
        role: adminData.role,
        accountType: 'business',
        isVerified: true,
        agreeToMarketing: false,
      });

      await newAdmin.save();
      
      console.log(`\n✅ Created admin user: ${adminData.name}`);
      console.log(`   📧 Email: ${adminData.email}`);
      console.log(`   🔑 Password: ${adminData.password}`);
      console.log(`   👤 Role: ${adminData.role}`);
    }

    console.log('\n\n📋 ADMIN LOGIN CREDENTIALS:');
    console.log('════════════════════════════════════════════════════════');
    console.log('\n1️⃣  SUPER ADMIN (Jane Kamunge)');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Email: janekamunge4@gmail.com');
    console.log('   Password: Jane2024!Admin');
    console.log('   Role: super_admin');
    
    console.log('\n2️⃣  ADMIN (Gerald)');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Email: admin@polyspackenterprises.co.ke');
    console.log('   Password: Gerald2024!Admin');
    console.log('   Role: admin');
    
    console.log('\n3️⃣  ADMIN (Polyspack Enterprise)');
    console.log('   URL: http://localhost:3000/admin/login');
    console.log('   Email: polyspackenterprise@gmail.com');
    console.log('   Password: Polyspack2024!Admin');
    console.log('   Role: admin');
    
    console.log('\n════════════════════════════════════════════════════════');
    console.log('\n📍 Customer Login: http://localhost:3000/login');
    console.log('📍 Customer Register: http://localhost:3000/register');
    console.log('📍 Admin Login: http://localhost:3000/admin/login');
    console.log('\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmins();
