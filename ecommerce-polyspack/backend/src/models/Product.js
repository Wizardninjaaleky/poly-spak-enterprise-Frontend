const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  images: [{ type: String }], // Cloudinary URLs
  sku: { type: String, unique: true },
  weight: { type: Number, min: 0 }, // For shipping calculations
  stockQty: { type: Number, required: true, min: 0, default: 0 },
  attributes: { type: Map, of: String }, // Flexible attributes (color, size, etc.)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for current price (sale price if available, otherwise regular price)
productSchema.virtual('currentPrice').get(function() {
  return this.salePrice || this.price;
});

// Pre-save middleware to generate slug and update timestamps
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
  this.updatedAt = Date.now();
  next();
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
