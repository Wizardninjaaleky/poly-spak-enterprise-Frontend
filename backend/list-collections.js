import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function listCollections() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('Collections in database:');
    console.log('========================\n');
    
    for (const coll of collections) {
      console.log(`- ${coll.name}`);
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`  Documents: ${count}\n`);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listCollections();
