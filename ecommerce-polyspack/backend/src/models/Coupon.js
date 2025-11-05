const mongoose = require('mongoose');

// Coupon Schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], required: true },
  value: { type: Number, required: true, min: 0 },
  minSpend: { type: Number, min: 0, default: 0 },
  appliesTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Empty array = all products
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, required: true },
  maxUses: { type: Number, min: 0 },
  usesCount: { type: Number, default: 0 },
  maxUsesPerCustomer: { type: Number, min: 1, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ endsAt: 1 });

// Instance methods
couponSchema.methods.isExpired = function() {
  return new Date() > this.endsAt;
};

couponSchema.methods.isUsageLimitReached = function() {
  return this.maxUses && this.usesCount >= this.maxUses;
};

couponSchema.methods.isValidForOrder = function(orderTotal, categories = []) {
  // Check if coupon is active and not expired
  if (!this.isActive || this.isExpired()) return false;

  // Check minimum spend
  if (orderTotal < this.minSpend) return false;

  // Check usage limit
  if (this.isUsageLimitReached()) return false;

  // Check category applicability (if specified)
  if (this.appliesTo.length > 0) {
    const hasApplicableCategory = categories.some(catId =>
      this.appliesTo.some(couponCatId => couponCatId.toString() === catId.toString())
    );
    if (!hasApplicableCategory) return false;
  }

  return true;
};

// Pre-save middleware to update timestamps
couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
