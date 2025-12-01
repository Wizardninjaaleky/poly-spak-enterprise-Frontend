import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'KES',
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank_transfer', 'cash'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Failed', 'Refunded', 'pending', 'completed', 'failed', 'refunded'],
    default: 'Pending',
  },
  transactionStatus: {
    type: String,
    enum: ['initiated', 'pending', 'completed', 'failed', 'cancelled'],
    default: 'initiated',
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  mpesaCode: {
    type: String,
    sparse: true,
  },
  mpesaReceiptNumber: {
    type: String,
    sparse: true,
  },
  checkoutRequestId: {
    type: String,
    sparse: true,
  },
  merchantRequestId: {
    type: String,
    sparse: true,
  },
  phoneNumber: {
    type: String,
  },
  transactionDate: {
    type: Date,
  },
  paymentDate: {
    type: Date,
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  failureReason: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Payment', paymentSchema);
