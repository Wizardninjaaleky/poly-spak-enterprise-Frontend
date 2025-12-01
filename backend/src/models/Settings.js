import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Website branding
  siteName: {
    type: String,
    default: 'Polyspack Enterprises',
  },
  siteTagline: {
    type: String,
    default: 'Quality Products for Your Business',
  },
  logo: {
    type: String,
    default: null, // Logo URL
  },
  favicon: {
    type: String,
    default: null, // Favicon URL
  },
  
  // Contact information
  contactEmail: {
    type: String,
    default: 'info@polyspack.co.ke',
  },
  contactPhone: {
    type: String,
    default: '+254 742 312306',
  },
  whatsappNumber: {
    type: String,
    default: '+254742312306',
  },
  address: {
    type: String,
    default: 'Nairobi, Kenya',
  },
  
  // Social media
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  
  // Payment settings
  mpesaPaybill: {
    type: String,
    default: '522533',
  },
  mpesaAccountNumber: {
    type: String,
    default: '8011202',
  },
  bankName: String,
  bankAccountNumber: String,
  bankAccountName: String,
  
  // Business settings
  currency: {
    type: String,
    default: 'KSh',
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 5000,
  },
  deliveryFee: {
    type: Number,
    default: 300,
  },
  
  // Email settings
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  smsNotifications: {
    type: Boolean,
    default: true,
  },
  
  // Maintenance mode
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
    default: 'Website is under maintenance. Please check back soon.',
  },
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  
  // Only one settings document should exist
  singleton: {
    type: Boolean,
    default: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  const Settings = this.constructor;
  if (this.isNew) {
    const count = await Settings.countDocuments();
    if (count > 0) {
      throw new Error('Settings document already exists. Use update instead.');
    }
  }
  next();
});

export default mongoose.model('Settings', settingsSchema);
