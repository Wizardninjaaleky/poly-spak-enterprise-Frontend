import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import Product model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  specifications: { type: String },
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const sampleProducts = [
  // Seedling Bags
  {
    name: 'Premium Seedling Bags - 3x5 inches',
    description: 'High-quality, eco-friendly seedling bags perfect for nurseries and tree planting projects. Made from durable UV-resistant material.',
    category: 'Seedling Bags',
    price: 5,
    stock: 10000,
    sku: 'SB-3X5-BLK',
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800'],
    specifications: 'Size: 3x5 inches\nMaterial: UV-resistant polyethylene\nColor: Black\nThickness: 150 microns\nDrainage holes: Yes',
    weight: 0.05,
    dimensions: { length: 3, width: 3, height: 5 },
    featured: true
  },
  {
    name: 'Large Seedling Bags - 6x9 inches',
    description: 'Larger seedling bags ideal for bigger plants and extended nursery periods. Ensures healthy root development.',
    category: 'Seedling Bags',
    price: 10,
    stock: 5000,
    sku: 'SB-6X9-BLK',
    images: ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'],
    specifications: 'Size: 6x9 inches\nMaterial: Heavy-duty polyethylene\nColor: Black\nThickness: 200 microns\nDrainage: Multiple holes',
    weight: 0.15,
    dimensions: { length: 6, width: 6, height: 9 },
    featured: true
  },
  {
    name: 'Biodegradable Seedling Bags - 4x6 inches',
    description: 'Eco-friendly biodegradable bags that decompose naturally. Perfect for environmentally conscious farming.',
    category: 'Seedling Bags',
    price: 8,
    stock: 8000,
    sku: 'SB-4X6-BIO',
    images: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'],
    specifications: 'Size: 4x6 inches\nMaterial: Biodegradable fiber\nColor: Natural brown\nDecomposition: 6-12 months\nEco-certified: Yes',
    weight: 0.08,
    dimensions: { length: 4, width: 4, height: 6 },
    featured: false
  },

  // Electronics
  {
    name: 'Digital Soil pH Meter',
    description: 'Professional-grade digital pH meter for accurate soil testing. Essential tool for optimal plant growth and farming success.',
    category: 'Electronics',
    price: 2500,
    stock: 50,
    sku: 'ELEC-PHM-001',
    images: ['https://images.unsplash.com/photo-1581093458791-9d42e1d1d5b9?w=800'],
    specifications: 'Range: pH 3.0-9.0\nAccuracy: ±0.1 pH\nDisplay: Digital LCD\nPower: 2x AAA batteries\nAuto-calibration: Yes\nWaterproof: IP65',
    weight: 0.2,
    dimensions: { length: 15, width: 5, height: 3 },
    featured: true
  },
  {
    name: 'Smart Irrigation Timer',
    description: 'Programmable irrigation controller with WiFi connectivity. Control your watering schedule from anywhere using your smartphone.',
    category: 'Electronics',
    price: 4500,
    stock: 30,
    sku: 'ELEC-SIT-002',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    specifications: 'Zones: 4 programmable zones\nConnectivity: WiFi + Bluetooth\nApp: iOS & Android\nPower: AC adapter included\nWeather sync: Yes\nRain delay: Automatic',
    weight: 0.5,
    dimensions: { length: 20, width: 15, height: 8 },
    featured: true
  },
  {
    name: 'Agricultural Drone - Crop Monitoring',
    description: 'Professional agricultural drone for crop monitoring and precision farming. 4K camera with multispectral imaging capabilities.',
    category: 'Electronics',
    price: 125000,
    stock: 5,
    sku: 'ELEC-DRN-003',
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
    specifications: 'Flight time: 35 minutes\nCamera: 4K + multispectral\nRange: 5km\nGPS: High-precision RTK\nMapping: Automated flight paths\nBattery: 2x included',
    weight: 2.5,
    dimensions: { length: 60, width: 60, height: 20 },
    featured: true
  },

  // Services
  {
    name: 'Farm Consultation Service - Basic',
    description: 'Professional agricultural consultation service. Get expert advice on crop selection, soil management, and farming best practices.',
    category: 'Services',
    price: 5000,
    stock: 100,
    sku: 'SRV-CONS-001',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
    specifications: 'Duration: 2 hours consultation\nIncludes: Site visit\nExpert: Certified agronomist\nReport: Written recommendations\nFollow-up: 1 phone call\nLocation: Within 50km radius',
    featured: true
  },
  {
    name: 'Irrigation System Installation',
    description: 'Complete drip irrigation system design and installation service. Customized solutions for farms of all sizes.',
    category: 'Services',
    price: 15000,
    stock: 50,
    sku: 'SRV-IRRI-002',
    images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
    specifications: 'Coverage: Up to 1 acre\nIncludes: Design + materials + labor\nSystem: Drip irrigation\nWarranty: 1 year\nMaintenance: 3 free visits\nTimeline: 3-5 days',
    featured: true
  },
  {
    name: 'Soil Testing & Analysis Service',
    description: 'Comprehensive soil testing service with detailed nutrient analysis and fertilizer recommendations.',
    category: 'Services',
    price: 3000,
    stock: 200,
    sku: 'SRV-SOIL-003',
    images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800'],
    specifications: 'Tests: NPK, pH, organic matter\nTurnaround: 5-7 days\nReport: Detailed analysis + recommendations\nSamples: Up to 3 locations\nCertified: ISO lab\nConsultation: Included',
    featured: false
  }
];

const createSampleProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Create sample products
    const created = await Product.insertMany(sampleProducts);
    console.log(`✓ Created ${created.length} sample products`);

    // Show summary by category
    const seedlingBags = created.filter(p => p.category === 'Seedling Bags').length;
    const electronics = created.filter(p => p.category === 'Electronics').length;
    const services = created.filter(p => p.category === 'Services').length;

    console.log('\n═══════════════════════════════════════');
    console.log('📦 Sample Products Created:');
    console.log('═══════════════════════════════════════');
    console.log(`🌱 Seedling Bags: ${seedlingBags} products`);
    console.log(`⚡ Electronics: ${electronics} products`);
    console.log(`🛠️  Services: ${services} products`);
    console.log('═══════════════════════════════════════\n');

    console.log('✓ You can now view these products at:');
    console.log('  - Customer site: https://polyspackenterprises.co.ke/products');
    console.log('  - Admin panel: https://polyspackenterprises.co.ke/admin/products');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

createSampleProducts();
