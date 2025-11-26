// MPESA service for handling payment verification
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendPaymentVerified } = require('./emailService');

// Verify MPESA payment (manual verification by admin)
const verifyPayment = async (orderId, transactionCode, verifiedBy) => {
  try {
    // Check if payment already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      throw new Error('Payment already verified for this order');
    }

    // Get order details
    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus === 'paid') {
      throw new Error('Order is already marked as paid');
    }

    // Create payment record
    const payment = new Payment({
      orderId,
      userId: order.userId._id,
      method: 'mpesa',
      amount: order.totalAmount,
      transactionCode,
      verified: true,
      verifiedBy,
      verifiedAt: new Date(),
    });

    await payment.save();

    // Update order status
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    // Send confirmation email
    await sendPaymentVerified(order, order.userId);

    return {
      success: true,
      message: 'Payment verified successfully',
      payment,
      order,
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

// Get payment details for an order
const getPaymentDetails = async (orderId) => {
  try {
    const payment = await Payment.findOne({ orderId }).populate('verifiedBy', 'name');
    return payment;
  } catch (error) {
    throw new Error(`Failed to get payment details: ${error.message}`);
  }
};

// Get all payments (admin only)
const getAllPayments = async (filters = {}) => {
  try {
    const query = {};

    if (filters.verified !== undefined) {
      query.verified = filters.verified;
    }

    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const payments = await Payment.find(query)
      .populate('orderId', 'orderNumber totalAmount status')
      .populate('userId', 'name email')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    return payments;
  } catch (error) {
    throw new Error(`Failed to get payments: ${error.message}`);
  }
};

// Get payment statistics
const getPaymentStats = async () => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          verifiedPayments: {
            $sum: { $cond: ['$verified', 1, 0] }
          },
          verifiedAmount: {
            $sum: { $cond: ['$verified', '$amount', 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      verifiedPayments: 0,
      verifiedAmount: 0,
    };
  } catch (error) {
    throw new Error(`Failed to get payment stats: ${error.message}`);
  }
};

module.exports = {
  verifyPayment,
  getPaymentDetails,
  getAllPayments,
  getPaymentStats,
};
