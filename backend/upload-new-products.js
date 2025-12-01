import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/polyspack-ecommerce';

// New products with correct details and images
const newProducts = [
  {
    name: 'High Power Digital Jump Starter with Compressor & Flashlight',
    description: 'Multifunctional car jump starter and air pump kit. Includes digital compressor with pressure gauge, adjustable flashlight, jumper cables, and carrying case. Perfect for emergency roadside assistance. Features LED display, multiple safety protections, and USB charging ports.',
    price: 9499,
    category: 'Automotive',
    images: ['/uploads/products/jump-starter-premium.jpg'],
    inStock: true,
    stock: 15,
    featured: true,
    specifications: {
      'Battery Capacity': '68800mAh',
      'Peak Current': '2000A',
      'Compressor': 'Digital with pressure gauge',
      'Flashlight': 'Adjustable LED',
      'USB Ports': '2 ports',
      'Display': 'LED digital display',
      'Safety Features': 'Reverse polarity, overcharge, short circuit protection',
      'Case': 'Hard carrying case included'
    },
    tags: ['jump starter', 'car accessories', 'emergency kit', 'compressor', 'flashlight', 'portable power'],
  },
  {
    name: 'High Power Jump Starter 68800mAh',
    description: 'Powerful portable car jump starter with 68800mAh battery capacity. Compact and lightweight design. Features LED flashlight, multiple USB charging ports, and jumper cables. Suitable for cars, motorcycles, and small vehicles.',
    price: 6800,
    category: 'Automotive',
    images: ['/uploads/products/jump-starter-basic.jpg'],
    inStock: true,
    stock: 25,
    featured: true,
    specifications: {
      'Battery Capacity': '68800mAh',
      'Peak Current': '1500A',
      'LED Flashlight': 'Yes',
      'USB Ports': 'Dual USB',
      'Weight': 'Lightweight portable design',
      'Suitable For': 'Cars, motorcycles, boats',
      'Safety Features': 'Overcharge protection, short circuit protection'
    },
    tags: ['jump starter', 'car accessories', 'emergency', 'portable', 'high power'],
  },
  {
    name: 'Premium Garbage Bags - Multiple Sizes',
    description: 'High-quality heavy-duty garbage bags suitable for home, office, and industrial use. Available in multiple sizes. Extra thick, leak-proof, and tear-resistant. Black color for discreet waste disposal.',
    price: 1200,
    category: 'Packaging',
    images: ['/uploads/products/garbage-bags.jpg'],
    inStock: true,
    stock: 100,
    featured: false,
    specifications: {
      'Material': 'High-density polyethylene (HDPE)',
      'Colors': 'Black',
      'Sizes': 'Small, Medium, Large',
      'Thickness': 'Extra thick',
      'Features': 'Leak-proof, tear-resistant',
      'Quantity': 'Roll of bags',
      'Usage': 'Home, office, industrial'
    },
    tags: ['garbage bags', 'waste bags', 'trash bags', 'heavy duty', 'packaging'],
  }
];

// Dummy products to remove (created before client started uploading)
const dummyProductNames = [
  'Premium Organic Fertilizer',
  'All-Purpose Plant Food',
  'Nitrogen-Rich Lawn Fertilizer',
  'Phosphorus Boost Fertilizer',
  'Potassium Plus Garden Mix',
  'Liquid Seaweed Extract',
  'Compost Starter Kit',
  'Slow-Release Granular Fertilizer',
  'Organic Bone Meal'
];

async function uploadProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove dummy products
    console.log('\n📦 Removing dummy products...');
    const deleteResult = await Product.deleteMany({ 
      name: { $in: dummyProductNames } 
    });
    console.log(`✅ Removed ${deleteResult.deletedCount} dummy products`);

    // Add new products
    console.log('\n📦 Adding new products...');
    for (const productData of newProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log(`⚠️  Product "${productData.name}" already exists, skipping...`);
        continue;
      }

      const product = new Product(productData);
      await product.save();
      console.log(`✅ Added: ${product.name} - KSh ${product.price}`);
    }

    // Show all products
    console.log('\n📊 Current Products in Database:');
    const allProducts = await Product.find().select('name price category inStock');
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - KSh ${p.price} (${p.category}) ${p.inStock ? '✅' : '❌'}`);
    });
    console.log(`\nTotal Products: ${allProducts.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Upload complete! Database connection closed.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadProducts();
