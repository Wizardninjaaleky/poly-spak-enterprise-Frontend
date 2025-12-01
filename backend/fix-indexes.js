import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');
    
    // Drop the sku index
    try {
      await collection.dropIndex('sku_1');
      console.log('✓ Dropped sku_1 index');
    } catch (err) {
      console.log('Index may not exist, continuing...');
    }

    // Delete all documents
    const result = await collection.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} products`);

    // Create new unique index on sku
    await collection.createIndex({ sku: 1 }, { unique: true, sparse: true });
    console.log('✓ Created new sparse unique index on sku');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

fixIndexes();
