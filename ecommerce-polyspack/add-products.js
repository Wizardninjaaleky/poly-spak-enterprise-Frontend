// Script to add products to the database
// Run with: node add-products.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './backend/src/models/Product.js';
import Category from './backend/src/models/Category.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/polyspack');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const addProducts = async () => {
  try {
    // First, create categories if they don't exist
    const categories = [
      {
        name: 'Seedling Bags',
        slug: 'seedling-bags',
        description: 'High-quality biodegradable seedling bags for nurseries',
        image: 'https://via.placeholder.com/400x300/4CAF50/white?text=Seedling+Bags'
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Energy-efficient electronic solutions',
        image: 'https://via.placeholder.com/400x300/2196F3/white?text=Electronics'
      },
      {
        name: 'Services',
        slug: 'services',
        description: 'Professional agricultural and technical services',
        image: 'https://via.placeholder.com/400x300/FF9800/white?text=Services'
      }
    ];

    const categoryMap = {};
    for (const catData of categories) {
      let category = await Category.findOne({ slug: catData.slug });
      if (!category) {
        category = await Category.create(catData);
        console.log(`Created category: ${category.name}`);
      }
      categoryMap[catData.name] = category._id;
    }

    // Now add products
    const products = [
      {
        title: 'Garbage & Biohazard Waste Bags - 100 Pack',
        slug: 'garbage-biohazard-waste-bags-100-pack',
        description: 'Strong, durable & leak-proof waste bags perfect for hospitals, hotels, clinics, offices, and home use. Heavy-duty material, different sizes & colors available. Suitable for medical, hotel & general waste. Clean, safe & hygienic waste disposal solution.',
        category: categoryMap['Seedling Bags'],
        price: 1500,
        images: ['https://via.placeholder.com/400x300/8B4513/white?text=Waste+Bags'],
        sku: 'WB-BIO-100',
        stockQty: 50,
        attributes: {
          size: 'Medium',
          material: 'Heavy-duty plastic',
          type: 'Biohazard',
          packSize: '100 bags'
        }
      },
      {
        title: 'Premium Seedling Bags - 100 Pack',
        slug: 'premium-seedling-bags-100-pack',
        description: 'High-quality biodegradable seedling bags perfect for nursery operations. Made from premium materials that ensure optimal growth conditions.',
        category: categoryMap['Seedling Bags'],
        price: 2500,
        salePrice: 2200,
        images: ['https://via.placeholder.com/400x300/4CAF50/white?text=Seedling+Bags'],
        sku: 'SB-100-PREM',
        stockQty: 75,
        attributes: {
          size: 'Medium',
          material: 'Biodegradable',
          packSize: '100 bags'
        }
      },
      {
        title: 'Solar-Powered LED Light',
        slug: 'solar-powered-led-light',
        description: 'Energy-efficient solar powered LED lighting solution. Perfect for outdoor and indoor use with long battery life.',
        category: categoryMap['Electronics'],
        price: 1500,
        images: ['https://via.placeholder.com/400x300/2196F3/white?text=Solar+LED+Light'],
        sku: 'EL-SOLAR-LED',
        stockQty: 25,
        attributes: {
          power: '5W',
          battery: '2000mAh',
          type: 'Solar-powered'
        }
      },
      {
        title: 'Agricultural Consulting Service',
        slug: 'agricultural-consulting-service',
        description: 'Expert agricultural consulting for optimal farm management. Full-day on-site consultation with experienced professionals.',
        category: categoryMap['Services'],
        price: 5000,
        images: ['https://via.placeholder.com/400x300/FF9800/white?text=Agricultural+Service'],
        sku: 'SVC-AGRI-CONSULT',
        stockQty: 10,
        attributes: {
          duration: 'Full Day',
          type: 'On-site',
          expertise: 'Agriculture'
        }
      }
    ];

    for (const productData of products) {
      const existingProduct = await Product.findOne({ sku: productData.sku });
      if (!existingProduct) {
        const product = await Product.create(productData);
        console.log(`Created product: ${product.title}`);
      } else {
        console.log(`Product already exists: ${productData.title}`);
      }
    }

    console.log('All products added successfully!');
  } catch (error) {
    console.error('Error adding products:', error);
  }
};

const run = async () => {
  await connectDB();
  await addProducts();
  process.exit(0);
};

run();
