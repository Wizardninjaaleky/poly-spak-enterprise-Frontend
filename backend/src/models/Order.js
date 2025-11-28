import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, default: 0, required: true },
  discountAmount: { type: Number, default: 0 },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'awaiting', 'paid', 'failed'], default: 'pending' },
  delivery: { type: Object, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
