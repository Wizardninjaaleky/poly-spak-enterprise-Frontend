const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../src/models/Product');

function generateSku() {
  return `SKU-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    const Category = require('../src/models/Category');
    let cat = await Category.findOne({ name: 'Seedling Bags' });
    if (!cat) cat = await Category.create({ name: 'Seedling Bags', slug: 'seedling-bags' });

    const title = 'Direct Seed Fertilizer';
    const slug = `direct-seed-${Date.now()}`;
    const sku = generateSku();

    const p = await Product.create({
      title,
      slug,
      description: 'Direct create test',
      category: cat._id,
      price: 1000,
      salePrice: 900,
      images: [],
      stockQty: 50,
      sku,
    });
    console.log('Created product', p._id.toString(), 'sku:', p.sku);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error creating product directly:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
