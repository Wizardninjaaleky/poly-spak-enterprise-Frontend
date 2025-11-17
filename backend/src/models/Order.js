import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  shippingAddress: Object
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
