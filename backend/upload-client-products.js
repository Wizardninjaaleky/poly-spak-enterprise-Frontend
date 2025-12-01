import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
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

const clientProducts = [
  // SEEDLING BAGS
  {
    name: 'Seedling Bags 3×5 - Trees, Tea, Melon, Tomato',
    description: 'Premium quality seedling bags perfect for trees, tea, melon, tomato & kai apple seedlings. UV-stabilized for long-lasting protection and healthy root development. Trusted by farmers nationwide for superior nursery performance.',
    category: 'Seedling Bags',
    price: 9000,
    stock: 20000,
    sku: 'SB-3X5-001',
    images: [
      '/uploads/products/seedling-bags-3x5.jpg',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
    ],
    specifications: 'Size: 3×5 inches\nQuantity: 20,000 pieces\nMaterial: UV-resistant polyethylene\nColor: Black\nThickness: 150 microns\nDrainage holes: Yes\nIdeal for: Trees, tea, melon, tomato & kai apple seedlings',
    weight: 0.05,
    dimensions: { length: 3, width: 3, height: 5 },
    featured: true
  },
  {
    name: 'Seedling Bags 4×6 - Trees, Pawpaw, Passion Fruit',
    description: 'High-quality seedling bags designed for exotic & indigenous trees, pawpaw, passion fruit, tree tomato, herbs & cutting propagation. Durable UV-stabilized material ensures strong root systems.',
    category: 'Seedling Bags',
    price: 12000,
    stock: 20000,
    sku: 'SB-4X6-002',
    images: [
      '/uploads/products/seedling-bags-4x6.jpg',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800'
    ],
    specifications: 'Size: 4×6 inches\nQuantity: 20,000 pieces\nMaterial: UV-resistant polyethylene\nColor: Black\nThickness: 180 microns\nDrainage: Multiple holes\nIdeal for: Exotic & indigenous trees, pawpaw, passion, tree tomato, herbs & cutting propagation',
    weight: 0.08,
    dimensions: { length: 4, width: 4, height: 6 },
    featured: true
  },
  {
    name: 'Seedling Bags 5×8 - Macadamia, Coffee, Bananas',
    description: 'Professional-grade seedling bags for macadamia, coffee & tissue bananas. Extra durable construction with superior drainage for optimal root health and crop success.',
    category: 'Seedling Bags',
    price: 11000,
    stock: 10000,
    sku: 'SB-5X8-003',
    images: [
      '/uploads/products/seedling-bags-5x8.jpg',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800'
    ],
    specifications: 'Size: 5×8 inches\nQuantity: 10,000 pieces\nMaterial: Heavy-duty UV-resistant polyethylene\nColor: Black\nThickness: 200 microns\nDrainage: Enhanced hole pattern\nIdeal for: Macadamia, coffee & tissue bananas',
    weight: 0.12,
    dimensions: { length: 5, width: 5, height: 8 },
    featured: true
  },
  {
    name: 'Seedling Bags 6×9 - Avocado, Mango, Orange, Cashew',
    description: 'Large capacity seedling bags ideal for avocados, macadamia, mangoes, oranges & cashew nuts. UV-stabilized for extended outdoor nursery use with excellent root support.',
    category: 'Seedling Bags',
    price: 13000,
    stock: 10000,
    sku: 'SB-6X9-004',
    images: [
      '/uploads/products/seedling-bags-6x9.jpg',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
    ],
    specifications: 'Size: 6×9 inches\nQuantity: 10,000 pieces\nMaterial: Premium UV-resistant polyethylene\nColor: Black\nThickness: 220 microns\nDrainage: Optimized pattern\nIdeal for: Avocados, macadamia, mangoes, oranges & cashew nuts',
    weight: 0.15,
    dimensions: { length: 6, width: 6, height: 9 },
    featured: true
  },
  {
    name: 'Seedling Bags 6×10×10 - Bamboo, Capsicums, Onions',
    description: 'Specialized rectangular seedling bags for bamboo, capsicums, onions & herbs. Superior stability and drainage for controlled nursery environments.',
    category: 'Seedling Bags',
    price: 9500,
    stock: 2000,
    sku: 'SB-6X10X10-005',
    images: [
      '/uploads/products/seedling-bags-6x10x10.jpg',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800'
    ],
    specifications: 'Size: 6×10×10 inches\nQuantity: 2,000 pieces\nMaterial: UV-resistant polyethylene\nColor: Black\nShape: Rectangular\nThickness: 200 microns\nIdeal for: Bamboo, capsicums, onions & herbs',
    weight: 0.18,
    dimensions: { length: 6, width: 10, height: 10 },
    featured: false
  },
  {
    name: 'Seedling Bags 6×10×12 - Capsicums',
    description: 'Perfect seedling bags for capsicum cultivation. Rectangular design provides optimal space for root development and plant stability in nursery conditions.',
    category: 'Seedling Bags',
    price: 11000,
    stock: 2000,
    sku: 'SB-6X10X12-006',
    images: [
      '/uploads/products/seedling-bags-6x10x12.jpg',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800'
    ],
    specifications: 'Size: 6×10×12 inches\nQuantity: 2,000 pieces\nMaterial: UV-resistant polyethylene\nColor: Black\nShape: Rectangular\nThickness: 220 microns\nIdeal for: Capsicums',
    weight: 0.22,
    dimensions: { length: 6, width: 10, height: 12 },
    featured: false
  },
  {
    name: 'Seedling Bags 7×12×12 - Ornamental Trees & Kitchen Garden',
    description: 'Large capacity seedling bags for ornamental trees & kitchen garden vegetables. Professional-grade quality with enhanced drainage for superior plant growth.',
    category: 'Seedling Bags',
    price: 14000,
    stock: 2000,
    sku: 'SB-7X12X12-007',
    images: [
      '/uploads/products/seedling-bags-7x12x12.jpg',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
    ],
    specifications: 'Size: 7×12×12 inches\nQuantity: 2,000 pieces\nMaterial: Heavy-duty UV-resistant polyethylene\nColor: Black\nShape: Rectangular\nThickness: 250 microns\nIdeal for: Ornamental trees & kitchen garden vegetables',
    weight: 0.28,
    dimensions: { length: 7, width: 12, height: 12 },
    featured: false
  },
  {
    name: 'Seedling Bags 8×14×14 - Greenhouse Tomatoes & Strawberries',
    description: 'Extra-large professional seedling bags ideal for greenhouse & open field tomatoes, capsicums, strawberries & kitchen vegetables. Maximum capacity for extended growing periods.',
    category: 'Seedling Bags',
    price: 16000,
    stock: 2000,
    sku: 'SB-8X14X14-008',
    images: [
      '/uploads/products/seedling-bags-8x14x14.jpg',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800'
    ],
    specifications: 'Size: 8×14×14 inches\nQuantity: 2,000 pieces\nMaterial: Premium UV-resistant polyethylene\nColor: Black\nShape: Rectangular\nThickness: 280 microns\nDrainage: Professional pattern\nIdeal for: Greenhouse & open field tomatoes, capsicums, strawberries & kitchen vegetables',
    weight: 0.35,
    dimensions: { length: 8, width: 14, height: 14 },
    featured: false
  },

  // SHADE NETS
  {
    name: 'Shade Net 90% - UV Stabilized (4m × 50m Roll)',
    description: 'Premium 90% shade net perfect for maximum sun protection in nurseries and sensitive crops. UV-stabilized for long-lasting performance. Smart protection for smart farmers - trusted nationwide.',
    category: 'Agricultural',
    price: 27000,
    stock: 50,
    sku: 'SN-90-4X50-009',
    images: [
      '/uploads/products/shade-net-90.jpg',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
    ],
    specifications: 'Shade Level: 90%\nSize: 4m × 50m roll (200 sqm coverage)\nMaterial: HDPE with UV stabilizer\nColor: Green\nWeight: 150 GSM\nLifespan: 3-5 years\nIdeal for: Shade houses, nurseries, delicate crops requiring maximum shade',
    weight: 15,
    dimensions: { length: 400, width: 5000, height: 5 },
    featured: true
  },
  {
    name: 'Shade Net 75% - UV Stabilized (4m × 50m Roll)',
    description: 'Versatile 75% shade net providing balanced sun protection for various crops. UV-stabilized HDPE material ensures durability. Competitive pricing for bulk buyers.',
    category: 'Agricultural',
    price: 21600,
    stock: 100,
    sku: 'SN-75-4X50-010',
    images: [
      '/uploads/products/shade-net-75.jpg',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800'
    ],
    specifications: 'Shade Level: 75%\nSize: 4m × 50m roll (200 sqm coverage)\nMaterial: HDPE with UV stabilizer\nColor: Green\nWeight: 130 GSM\nLifespan: 3-5 years\nIdeal for: General farming, greenhouse covers, vegetable gardens',
    weight: 13,
    dimensions: { length: 400, width: 5000, height: 5 },
    featured: true
  },
  {
    name: 'Shade Net 55% - UV Stabilized (4m × 50m Roll)',
    description: 'Light shade net 55% for crops requiring moderate sun protection. UV-stabilized for extended outdoor use. Quality that supports strong, healthy growth - trusted by farmers nationwide.',
    category: 'Agricultural',
    price: 14000,
    stock: 150,
    sku: 'SN-55-4X50-011',
    images: [
      '/uploads/products/shade-net-55.jpg',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
    ],
    specifications: 'Shade Level: 55%\nSize: 4m × 50m roll (200 sqm coverage)\nMaterial: HDPE with UV stabilizer\nColor: Green\nWeight: 100 GSM\nLifespan: 3-5 years\nIdeal for: Light shade crops, windbreaks, poultry shelters',
    weight: 10,
    dimensions: { length: 400, width: 5000, height: 5 },
    featured: true
  },

  // ELECTRONICS / FITNESS
  {
    name: 'York 50kg Dumbbells Set - Professional Fitness Equipment',
    description: 'Premium York 50kg adjustable dumbbell set for professional home and gym training. Heavy-duty construction with secure locking mechanism. Includes carrying case for easy storage and transport.',
    category: 'Electronics',
    price: 13500,
    stock: 20,
    sku: 'YORK-DB-50KG-012',
    images: [
      '/uploads/products/york-dumbbells.jpg',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
    ],
    specifications: 'Total Weight: 50kg\nAdjustable: Yes\nIncludes: Dumbbells, weight plates, carrying case\nPlate Sizes: 5kg, 10kg, 15kg, 20kg\nBar Material: Chrome-plated steel\nGrip: Ergonomic textured handles\nCase: Durable molded plastic with secure latches',
    weight: 50,
    dimensions: { length: 80, width: 40, height: 15 },
    featured: true
  },

  // STANLEY CUPS
  {
    name: 'Stanley Quencher Tumbler 1.2L - Floral Collection',
    description: 'Premium Stanley Quencher H2.0 FlowState Tumbler 1.2L with beautiful marble-coated floral designs. Keeps drinks cold for 11 hours, hot for 7 hours. Features reusable straw and handle for easy carrying. Available in purple, white, and pink floral patterns.',
    category: 'Electronics',
    price: 2500,
    stock: 100,
    sku: 'STAN-QT-1.2L-013',
    images: [
      '/uploads/products/stanley-cups.jpg',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'
    ],
    specifications: 'Capacity: 1.2 Liters (40oz)\nMaterial: 18/8 stainless steel\nFinish: Marble-coated floral design\nInsulation: Double-wall vacuum\nCold retention: 11 hours\nHot retention: 7 hours\nFeatures: Reusable straw, comfort-grip handle, car cup holder compatible\nColors: Purple floral, White floral, Pink floral\nLeak-proof: Yes',
    weight: 0.5,
    dimensions: { length: 10, width: 10, height: 30 },
    featured: true
  },

  // WASTE BAGS
  {
    name: 'Biohazard Medical Waste Bags - Hospital Grade (Red/Yellow)',
    description: 'Professional biohazard infectious waste bags for hospitals, clinics, and medical facilities. Heavy-duty leak-proof material with clear biohazard symbol markings. Available in red and yellow colors for proper waste segregation.',
    category: 'Packaging',
    price: 1500,
    stock: 500,
    sku: 'BIO-MED-BAG-014',
    images: [
      '/uploads/products/biohazard-bags.jpg',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800'
    ],
    specifications: 'Material: Heavy-duty LDPE\nThickness: 100 microns\nStrength: High tensile\nColors: Red, Yellow\nSymbol: Biohazard marking\nSizes: Various (specify on order)\nIdeal for: Hospitals, clinics, labs, dental offices\nFeatures: Leak-proof, puncture-resistant, color-coded for waste segregation\nCompliance: Medical waste disposal standards',
    weight: 0.2,
    featured: true
  },
  {
    name: 'Commercial Garbage Bags - Multi-Purpose (Black/White/Gray)',
    description: 'Durable commercial-grade garbage bags suitable for hotels, offices, hospitals, and home use. Strong, leak-proof material in various sizes and colors. Clean, safe & hygienic waste disposal solution.',
    category: 'Packaging',
    price: 1500,
    stock: 1000,
    sku: 'GARB-COMM-015',
    images: [
      '/uploads/products/garbage-bags.jpg',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800'
    ],
    specifications: 'Material: HDPE/LDPE blend\nThickness: 80 microns\nColors: Black, White, Gray\nSizes: Small, Medium, Large, Extra Large\nFeatures: Tear-resistant, leak-proof, odor-blocking\nIdeal for: Hotels, offices, hospitals, clinics, home use\nPackaging: Roll format or individual bags\nCapacity: 20L to 120L (depending on size)',
    weight: 0.15,
    featured: false
  }
];

const uploadProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Upload products
    const created = await Product.insertMany(clientProducts);
    console.log(`✓ Successfully uploaded ${created.length} products`);

    // Show summary by category
    const seedlingBags = created.filter(p => p.category === 'Seedling Bags').length;
    const agricultural = created.filter(p => p.category === 'Agricultural').length;
    const electronics = created.filter(p => p.category === 'Electronics').length;
    const packaging = created.filter(p => p.category === 'Packaging').length;

    console.log('\n═══════════════════════════════════════');
    console.log('📦 Products Successfully Uploaded:');
    console.log('═══════════════════════════════════════');
    console.log(`🌱 Seedling Bags: ${seedlingBags} products`);
    console.log(`🌾 Agricultural (Shade Nets): ${agricultural} products`);
    console.log(`⚡ Electronics (Fitness & Stanley): ${electronics} products`);
    console.log(`📦 Packaging (Waste Bags): ${packaging} products`);
    console.log('═══════════════════════════════════════\n');

    console.log('✅ All products are now live at:');
    console.log('   Customer: https://polyspackenterprises.co.ke/products');
    console.log('   Admin: https://polyspackenterprises.co.ke/admin/products');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate SKU found. Some products may already exist.');
    }
    process.exit(1);
  }
};

uploadProducts();
