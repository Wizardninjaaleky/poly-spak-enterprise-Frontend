import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Polyspack Enterprises',
  },
  siteDescription: {
    type: String,
    default: 'Kenya\'s Leading Plastic Packaging Manufacturer',
  },
  logo: {
    type: String,
  },
  favicon: {
    type: String,
  },
  contactEmail: {
    type: String,
    default: 'sales@polyspackenterprises.co.ke',
  },
  contactPhone: {
    type: String,
    default: '+254 742 312306',
  },
  address: {
    street: String,
    city: String,
    country: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    tiktok: String,
    whatsapp: {
      type: String,
      default: '254742312306',
    },
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  maintenanceMessage: {
    type: String,
  },
  featuredCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  heroSection: {
    title: String,
    subtitle: String,
    image: String,
    ctaText: String,
    ctaLink: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('WebsiteSettings', websiteSettingsSchema);
