import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function fixProductImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`\n📦 Found ${products.length} products`);

    let updatedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // Check if images array is empty or has invalid paths
      if (!product.images || product.images.length === 0 || 
          (product.images[0] && !product.images[0].startsWith('http') && !product.images[0].startsWith('/'))) {
        
        // Set default placeholder based on category or product name
        const categoryName = product.category?.name || '';
        const productName = product.name.toLowerCase();

        let placeholderImage = '/images/products/placeholder.jpg';

        // Category-specific placeholders
        if (productName.includes('solar') || categoryName.includes('Solar')) {
          placeholderImage = '/images/products/solar-placeholder.jpg';
        } else if (productName.includes('jump starter') || productName.includes('automotive')) {
          placeholderImage = '/images/products/automotive-placeholder.jpg';
        } else if (productName.includes('shaver') || productName.includes('trimmer') || productName.includes('grooming')) {
          placeholderImage = '/images/products/grooming-placeholder.jpg';
        } else if (productName.includes('blood pressure') || productName.includes('medical')) {
          placeholderImage = '/images/products/medical-placeholder.jpg';
        } else if (productName.includes('bag') || productName.includes('seedling')) {
          placeholderImage = '/images/products/packaging-placeholder.jpg';
        } else if (productName.includes('shade net')) {
          placeholderImage = '/images/products/shade-net-placeholder.jpg';
        }

        updates.images = [placeholderImage];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updates);
        console.log(`✅ Updated: ${product.name} - Added placeholder image`);
        updatedCount++;
      }
    }

    console.log(`\n✅ Updated ${updatedCount} products with placeholder images`);
    console.log('\n📝 Note: Replace placeholder images with actual product photos through the admin panel');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductImages();
