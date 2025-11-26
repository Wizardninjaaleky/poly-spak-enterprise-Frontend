const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../src/models/Product');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find or create a default category id - create one if none exists
    const Category = require('../src/models/Category');
    let category = await Category.findOne();
    if (!category) {
      const slug = 'fertilizers';
      category = await Category.create({ name: 'Fertilizers', slug, description: 'Default fertilizer category' });
      console.log('Created default category:', category._id.toString());
    }
    const categoryId = category._id;

    const productData = {
      title: 'Seed Test Fertilizer',
      slug: `seed-test-fertilizer-${Date.now()}`,
      description: 'Seeded product for API tests',
      category: categoryId,
      price: 1200,
      salePrice: 1000,
      images: ['https://via.placeholder.com/500x500?text=Fertilizer'],
      sku: `SEED-${Date.now()}`,
      weight: 5,
      stockQty: 100,
      attributes: { N: '10', P: '10', K: '10' },
      isActive: true,
    };

    const product = await Product.create(productData);
    console.log('✅ Seed product created:', product._id.toString());
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
