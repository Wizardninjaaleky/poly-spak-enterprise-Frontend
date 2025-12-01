import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://alexnyakundi56_db_user:Admin@cluster0.lgqojwx.mongodb.net/polyspack-ecommerce';

// New products: Blood Pressure Monitor and Solar Lights
const newProducts = [
  {
    name: 'Automatic Digital ARM Blood Pressure Monitor',
    description: 'Digital blood pressure monitor with heart rate and pulse meter. Features large LCD display with color indicator (red/yellow/green), memory storage, and accurate WHO blood pressure classification. Includes arm cuff suitable for standard arm sizes. Perfect for home health monitoring.',
    price: 2900,
    sku: 'HEALTH-BP-MONITOR-001',
    categoryName: 'Health & Medical',
    images: ['/uploads/products/blood-pressure-monitor.jpg'],
    inStock: true,
    stock: 30,
    featured: true,
    specifications: {
      'Type': 'Upper Arm Blood Pressure Monitor',
      'Display': 'Large LCD with color indicator',
      'Measurement': 'Systolic, Diastolic, Pulse',
      'Memory': 'Stores multiple readings',
      'WHO Classification': 'Yes (color-coded)',
      'Cuff Size': 'Standard arm (22-42cm)',
      'Power': 'Battery operated',
      'Accuracy': 'Clinical grade accuracy'
    },
    tags: ['blood pressure', 'health monitor', 'medical device', 'tensiometer', 'heart rate', 'pulse meter', 'WHO standard'],
  },
  {
    name: 'JSOT Solar Flood Light - 50W',
    description: 'High-efficiency solar flood light with 50W LED. Includes solar panel, remote control, and waterproof design. Perfect for outdoor lighting, security, and energy-saving illumination. Auto on/off with dusk-to-dawn sensor.',
    price: 4800,
    sku: 'SOLAR-JSOT-50W-001',
    categoryName: 'Solar & Lighting',
    images: ['/uploads/products/solar-light-50w.jpg'],
    inStock: true,
    stock: 20,
    featured: true,
    specifications: {
      'Power': '50W LED',
      'Brand': 'JSOT',
      'Model': 'JS-T50',
      'Solar Panel': 'High-efficiency polycrystalline',
      'Battery': 'Lithium battery included',
      'Remote Control': 'Yes',
      'Waterproof': 'IP65 rated',
      'Lighting Time': '8-12 hours (fully charged)',
      'Sensor': 'Dusk-to-dawn auto on/off'
    },
    tags: ['solar light', 'flood light', 'outdoor lighting', 'JSOT', 'energy saving', '50 watts'],
  },
  {
    name: 'JSOT Solar Flood Light - 30W',
    description: 'Compact 30W solar flood light with high-efficiency LED. Includes solar panel and remote control. Waterproof design ideal for gardens, pathways, and security lighting. Energy-efficient and eco-friendly.',
    price: 4500,
    sku: 'SOLAR-JSOT-30W-002',
    categoryName: 'Solar & Lighting',
    images: ['/uploads/products/solar-light-30w.jpg'],
    inStock: true,
    stock: 25,
    featured: true,
    specifications: {
      'Power': '30W LED',
      'Brand': 'JSOT',
      'Solar Panel': 'High-efficiency',
      'Battery': 'Lithium battery',
      'Remote Control': 'Yes',
      'Waterproof': 'IP65 rated',
      'Lighting Time': '8-10 hours',
      'Application': 'Garden, pathway, security'
    },
    tags: ['solar light', 'flood light', 'outdoor', 'JSOT', '30 watts', 'garden lighting'],
  },
  {
    name: 'JSOT Solar Flood Light - 100W',
    description: 'Powerful 100W solar flood light for large areas. Ultra-bright LED with solar panel and remote control. Industrial-grade waterproof design. Perfect for parking lots, warehouses, and commercial spaces.',
    price: 5800,
    sku: 'SOLAR-JSOT-100W-003',
    categoryName: 'Solar & Lighting',
    images: ['/uploads/products/solar-light-100w.jpg'],
    inStock: true,
    stock: 15,
    featured: true,
    specifications: {
      'Power': '100W LED',
      'Brand': 'JSOT',
      'Solar Panel': 'High-efficiency polycrystalline',
      'Battery': 'Large capacity lithium',
      'Remote Control': 'Yes',
      'Waterproof': 'IP65 rated',
      'Lighting Time': '10-14 hours',
      'Coverage': 'Large area illumination',
      'Application': 'Commercial, industrial, parking'
    },
    tags: ['solar light', 'flood light', 'JSOT', '100 watts', 'industrial', 'commercial lighting'],
  },
  {
    name: 'JSOT Solar Flood Light - 200W',
    description: 'Super powerful 200W solar flood light for maximum illumination. Industrial-grade LED with large solar panel. Perfect for stadiums, large warehouses, and outdoor events. Includes remote control and weather-resistant construction.',
    price: 7500,
    sku: 'SOLAR-JSOT-200W-004',
    categoryName: 'Solar & Lighting',
    images: ['/uploads/products/solar-light-200w.jpg'],
    inStock: true,
    stock: 10,
    featured: true,
    specifications: {
      'Power': '200W LED',
      'Brand': 'JSOT',
      'Solar Panel': 'Large polycrystalline panel',
      'Battery': 'Extra-large lithium battery',
      'Remote Control': 'Yes',
      'Waterproof': 'IP66 rated',
      'Lighting Time': '12-16 hours',
      'Brightness': 'Ultra-bright 20000+ lumens',
      'Application': 'Stadium, warehouse, events'
    },
    tags: ['solar light', 'flood light', 'JSOT', '200 watts', 'stadium lighting', 'ultra-bright'],
  },
  {
    name: 'JSOT Solar Flood Light - 300W',
    description: 'Maximum power 300W solar flood light for extreme illumination needs. Professional-grade LED with extra-large solar panel. Weather-proof and built for 24/7 operation. Ideal for large commercial and industrial applications.',
    price: 8000,
    sku: 'SOLAR-JSOT-300W-005',
    categoryName: 'Solar & Lighting',
    images: ['/uploads/products/solar-light-300w.jpg'],
    inStock: true,
    stock: 8,
    featured: true,
    specifications: {
      'Power': '300W LED',
      'Brand': 'JSOT',
      'Solar Panel': 'Extra-large high-efficiency',
      'Battery': 'Professional-grade lithium',
      'Remote Control': 'Yes',
      'Waterproof': 'IP66 rated',
      'Lighting Time': '14-18 hours',
      'Brightness': '30000+ lumens',
      'Durability': '50,000+ hours lifespan',
      'Application': 'Large commercial, industrial'
    },
    tags: ['solar light', 'flood light', 'JSOT', '300 watts', 'professional', 'maximum power'],
  }
];

async function uploadProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get or create categories
    console.log('📂 Managing categories...');
    const categories = {};
    
    for (const productData of newProducts) {
      const catName = productData.categoryName;
      if (!categories[catName]) {
        let category = await Category.findOne({ name: catName });
        if (!category) {
          category = await Category.create({
            name: catName,
            description: `${catName} products`,
            slug: catName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
          });
          console.log(`✅ Created category: ${catName}`);
        }
        categories[catName] = category._id;
      }
    }

    // Add new products
    console.log('\n📦 Adding new products...');
    for (const productData of newProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ sku: productData.sku });
      
      if (existingProduct) {
        console.log(`⚠️  Product "${productData.name}" already exists, skipping...`);
        continue;
      }

      // Add category ID
      productData.category = categories[productData.categoryName];
      delete productData.categoryName;

      const product = new Product(productData);
      await product.save();
      console.log(`✅ Added: ${product.name} - KSh ${product.price} (SKU: ${product.sku})`);
    }

    // Show summary
    console.log('\n📊 Product Summary:');
    const allProducts = await Product.find().populate('category').select('name price category sku');
    
    const byCat = {};
    allProducts.forEach(p => {
      const cat = p.category?.name || 'No Category';
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(p);
    });
    
    Object.keys(byCat).sort().forEach(cat => {
      console.log(`\n${cat} (${byCat[cat].length} products):`);
      byCat[cat].forEach(p => {
        console.log(`  - ${p.name} - KSh ${p.price}`);
      });
    });
    
    console.log(`\n✅ Total Products: ${allProducts.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Upload complete! Database connection closed.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadProducts();
