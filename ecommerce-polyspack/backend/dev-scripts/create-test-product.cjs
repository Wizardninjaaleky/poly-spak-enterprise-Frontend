const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../src/models/Product');

async function createTestProduct() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoUri);

    // Delete existing test products
    await Product.deleteMany({ name: 'Test Product' });

    // Create test product
    const product = await Product.create({
      name: 'Test Product',
      description: 'A test product for API validation',
      price: 1000,
      discountedPrice: 900,
      category: 'Test',
      stock: 50,
      images: ['https://via.placeholder.com/500'],
    });

    console.log('✅ Test Product Created');
    console.log(`   ID: ${product._id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Price: ${product.price}`);
    console.log(`   Stock: ${product.stock}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTestProduct();
