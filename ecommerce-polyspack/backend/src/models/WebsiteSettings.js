const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    default: null
  },
  siteName: {
    type: String,
    default: 'Polyspack Enterprises'
  },
  siteDescription: {
    type: String,
    default: 'Your trusted partner for seedling bags, electronics, and services'
  },
  contactEmail: {
    type: String,
    default: 'info@polyspack.com'
  },
  contactPhone: {
    type: String,
    default: '+254 XXX XXX XXX'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Only allow one document for website settings
websiteSettingsSchema.pre('save', async function(next) {
  const count = await mongoose.model('WebsiteSettings').countDocuments();
  if (count >= 1 && this.isNew) {
    const error = new Error('Only one website settings document is allowed');
    return next(error);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
