const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri);
    const Category = require('./src/models/Category');
    let cat = await Category.findOne({ name: 'Seedling Bags' });
    if (!cat) cat = await Category.create({ name: 'Seedling Bags', slug: 'seedling-bags' });

    const p = await Product.create({
      title: 'Direct Seed Fertilizer',
      slug: `direct-seed-${Date.now()}`,
      description: 'Direct create test',
      category: cat._id,
      price: 1000,
      salePrice: 900,
      images: [],
      stockQty: 50,
    });
    console.log('Created product', p._id.toString());
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error creating product directly:', err.message);
    process.exit(1);
  }
}

run();
