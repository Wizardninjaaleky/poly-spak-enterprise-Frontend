const Coupon = require('../models/Coupon');
const FlashSale = require('../models/FlashSale');
const Product = require('../models/Product');

// Calculate discount for an order
const calculateOrderDiscount = async (items, couponCode = null) => {
  try {
    let totalDiscount = 0;
    let appliedCoupon = null;
    let appliedFlashSales = [];

    // Calculate item subtotals first
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('category');
      if (!product) continue;

      const price = product.currentPrice;
      subtotal += price * item.qty;
    }

    // Apply flash sales first (can stack)
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('category');
      if (!product) continue;

      const flashSales = await FlashSale.find({
        active: true,
        startsAt: { $lte: new Date() },
        endsAt: { $gte: new Date() },
      });

      for (const flashSale of flashSales) {
        if (flashSale.appliesToProduct(item.productId)) {
          const originalPrice = product.currentPrice;
          const discountedPrice = flashSale.getDiscountedPrice(originalPrice);
          const itemDiscount = (originalPrice - discountedPrice) * item.qty;

          totalDiscount += itemDiscount;
          appliedFlashSales.push({
            flashSaleId: flashSale._id,
            name: flashSale.name,
            discount: itemDiscount,
          });
          break; // Apply only the first applicable flash sale per product
        }
      }
    }

    // Apply coupon last (single best discount)
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (coupon && coupon.isValidForOrder(subtotal, items.map(item => item.category))) {
        let couponDiscount = 0;

        if (coupon.type === 'percentage') {
          couponDiscount = subtotal * (coupon.value / 100);
        } else if (coupon.type === 'fixed') {
          couponDiscount = coupon.value;
        } else if (coupon.type === 'free_shipping') {
          // This would be handled separately in shipping calculation
          couponDiscount = 0;
        }

        // Ensure discount doesn't exceed subtotal
        couponDiscount = Math.min(couponDiscount, subtotal);

        totalDiscount += couponDiscount;
        appliedCoupon = {
          couponId: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discount: couponDiscount,
        };

        // Increment coupon usage
        coupon.usesCount += 1;
        await coupon.save();
      }
    }

    return {
      totalDiscount,
      appliedCoupon,
      appliedFlashSales,
      subtotal,
    };
  } catch (error) {
    throw new Error(`Discount calculation failed: ${error.message}`);
  }
};

// Get applicable coupons for a user
const getApplicableCoupons = async (userId, orderTotal, categories = []) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() },
    });

    const applicableCoupons = [];

    for (const coupon of coupons) {
      if (coupon.isValidForOrder(orderTotal, categories)) {
        applicableCoupons.push(coupon);
      }
    }

    return applicableCoupons;
  } catch (error) {
    throw new Error(`Failed to get applicable coupons: ${error.message}`);
  }
};

// Get active flash sales
const getActiveFlashSales = async () => {
  try {
    const flashSales = await FlashSale.find({
      active: true,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() },
    }).populate('productIds', 'title slug images');

    return flashSales;
  } catch (error) {
    throw new Error(`Failed to get active flash sales: ${error.message}`);
  }
};

// Apply discount to product price (for display purposes)
const getDiscountedProductPrice = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return null;

    let finalPrice = product.currentPrice;
    let appliedDiscount = null;

    // Check for flash sales
    const flashSales = await FlashSale.find({
      active: true,
      startsAt: { $lte: new Date() },
      endsAt: { $gte: new Date() },
    });

    for (const flashSale of flashSales) {
      if (flashSale.appliesToProduct(productId)) {
        const discountedPrice = flashSale.getDiscountedPrice(finalPrice);
        if (discountedPrice < finalPrice) {
          finalPrice = discountedPrice;
          appliedDiscount = {
            type: 'flash_sale',
            flashSaleId: flashSale._id,
            name: flashSale.name,
            discountType: flashSale.discountType,
            discountValue: flashSale.discountValue,
          };
        }
        break; // Apply only the first applicable flash sale
      }
    }

    return {
      originalPrice: product.price,
      salePrice: product.salePrice,
      finalPrice,
      appliedDiscount,
      discountAmount: product.price - finalPrice,
    };
  } catch (error) {
    throw new Error(`Failed to get discounted product price: ${error.message}`);
  }
};

module.exports = {
  calculateOrderDiscount,
  getApplicableCoupons,
  getActiveFlashSales,
  getDiscountedProductPrice,
};
