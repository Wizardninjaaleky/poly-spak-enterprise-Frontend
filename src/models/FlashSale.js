const mongoose = require('mongoose');

// FlashSale Schema
const flashSaleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
flashSaleSchema.index({ startsAt: 1 });
flashSaleSchema.index({ endsAt: 1 });
flashSaleSchema.index({ active: 1 });

// Instance methods
flashSaleSchema.methods.isActive = function() {
  const now = new Date();
  return this.active && now >= this.startsAt && now <= this.endsAt;
};

flashSaleSchema.methods.getDiscountedPrice = function(originalPrice) {
  if (!this.isActive()) return originalPrice;

  if (this.discountType === 'percentage') {
    return originalPrice * (1 - this.discountValue / 100);
  } else if (this.discountType === 'fixed') {
    return Math.max(0, originalPrice - this.discountValue);
  }

  return originalPrice;
};

flashSaleSchema.methods.appliesToProduct = function(productId) {
  // If no specific products, applies to all
  if (this.productIds.length === 0) return true;

  return this.productIds.some(id => id.toString() === productId.toString());
};

// Pre-save middleware to update timestamps
flashSaleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FlashSale', flashSaleSchema);
