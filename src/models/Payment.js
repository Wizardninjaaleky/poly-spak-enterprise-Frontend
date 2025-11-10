const mongoose = require('mongoose');

// Payment Schema for manual M-Pesa verification
const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  phoneNumber: { type: String, required: true },
  mpesaCode: { type: String, required: true, unique: true },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who verified
  verifiedAt: Date,
  rejectionReason: String,
  timestamp: { type: Date, default: Date.now }
});

// Index for efficient queries
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ mpesaCode: 1 });
paymentSchema.index({ timestamp: -1 });

// Pre-save middleware to update timestamps
paymentSchema.pre('save', function(next) {
  this.timestamp = Date.now();
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
