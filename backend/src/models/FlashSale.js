import mongoose from 'mongoose';

const flashSaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Flash sale name is required'],
    trim: true,
  },
  description: {
    type: String,
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: 0,
    max: 100,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    originalPrice: Number,
    salePrice: Number,
    stock: Number,
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  banner: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('FlashSale', flashSaleSchema);
