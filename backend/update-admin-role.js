import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateUserRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // First, let's find the most recent user
    const users = await mongoose.connection.db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log('\n📋 Recent users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || user.name} - Role: ${user.role}`);
    });

    const email = 'admin@polyspackenterprises.co.ke';
    
    // Try to update by email (case insensitive)
    let result = await mongoose.connection.db.collection('users').updateOne(
      { email: { $regex: new RegExp('^' + email + '$', 'i') } },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log('\n✓ User role updated to admin successfully!');
      console.log('Email:', email);
    } else {
      // If not found, update the most recent user
      if (users.length > 0) {
        const latestUser = users[0];
        result = await mongoose.connection.db.collection('users').updateOne(
          { _id: latestUser._id },
          { $set: { role: 'admin' } }
        );
        console.log(`\n✓ Updated most recent user to admin: ${latestUser.email || latestUser.name}`);
      } else {
        console.log('\n✗ No users found in database');
      }
    }

    console.log('\nYou can now login at: http://localhost:3000/admin/login');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

updateUserRole();
