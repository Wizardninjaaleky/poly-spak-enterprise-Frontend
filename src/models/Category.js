const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  image: String, // Category banner image URL (Cloudinary)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient queries
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Category', categorySchema);
