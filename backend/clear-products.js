import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const result = await mongoose.connection.db.collection('products').deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} products from database`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

clearProducts();
