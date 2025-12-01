import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const shaverProduct = {
  name: 'Vintage Rechargeable Hair Trimmer & Shaver',
  description: 'Professional vintage-style rechargeable hair trimmer and shaver with premium gold dragon design. Perfect for precise grooming and styling.',
  price: 1500,
  sku: 'GROOM-SHAVER-VINTAGE-001',
  inStock: true,
  category: null, // Will be set after finding/creating category
  specifications: {
    'Type': 'Rechargeable Hair Trimmer & Shaver',
    'Design': 'Vintage Gold Dragon Pattern',
    'Power': 'Rechargeable Battery',
    'Charging': 'USB Charging Cable Included',
    'Accessories': 'Cleaning brush, blade guards, charging cable, oil bottle',
    'Blade': 'Precision stainless steel blade',
    'Usage': 'Hair trimming, beard shaping, body grooming',
    'Material': 'Premium metal construction'
  },
  features: [
    'Vintage dragon embossed design',
    'Rechargeable battery for cordless operation',
    'USB charging for convenience',
    'Precision trimming blade',
    'Includes cleaning brush and maintenance oil',
    'Multiple blade guards included',
    'Durable metal construction',
    'Professional-grade grooming'
  ],
  tags: ['grooming', 'shaver', 'trimmer', 'rechargeable', 'vintage', 'hair clipper', 'beard trimmer', 'barber'],
  images: ['/uploads/products/vintage-shaver.jpg']
};

async function uploadProduct() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create "Personal Care & Grooming" category
    let category = await Category.findOne({ name: 'Personal Care & Grooming' });
    
    if (!category) {
      category = await Category.create({
        name: 'Personal Care & Grooming',
        description: 'Personal care, grooming, and hygiene products'
      });
      console.log('✅ Created category: Personal Care & Grooming');
    } else {
      console.log('✅ Found category: Personal Care & Grooming');
    }

    shaverProduct.category = category._id;

    // Check if product already exists
    const existingProduct = await Product.findOne({ sku: shaverProduct.sku });
    
    if (existingProduct) {
      console.log('⚠️  Product already exists:', existingProduct.name);
    } else {
      const product = await Product.create(shaverProduct);
      console.log(`✅ Added: ${product.name} - KSh ${product.price} (SKU: ${product.sku})`);
    }

    // Display total products
    const totalProducts = await Product.countDocuments();
    console.log(`\n📦 Total Products: ${totalProducts}`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadProduct();
