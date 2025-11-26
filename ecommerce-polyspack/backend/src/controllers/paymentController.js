const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');
const { verifyPayment, getPaymentDetails, getAllPayments, getPaymentStats } = require('../services/mpesaService');

// @desc    Submit M-Pesa payment for verification
// @route   POST /api/payments/submit
// @access  Private
exports.submitPayment = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { orderId, amount, phoneNumber, mpesaCode, recaptchaToken } = req.body;

  try {
    // Check if order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to submit payment for this order',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid',
      });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already submitted for this order',
      });
    }

    // Check if M-Pesa code is already used
    const existingCode = await Payment.findOne({ mpesaCode });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'This M-Pesa code has already been used',
      });
    }

    // Create payment record with Pending status
    const payment = new Payment({
      orderId,
      userId: req.user.id,
      amount,
      phoneNumber,
      mpesaCode,
      paymentStatus: 'Pending'
    });

    await payment.save();

    // Update order status to awaiting payment verification
    order.paymentStatus = 'awaiting';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment submitted successfully. Please wait for confirmation.',
      data: {
        paymentId: payment._id,
        orderId: order._id,
        status: payment.paymentStatus
      },
    });
  } catch (error) {
    console.error('Payment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get payment details for user's order
// @route   GET /api/payments/order/:orderId
// @access  Private
exports.getOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this payment',
      });
    }

    const payment = await getPaymentDetails(req.params.orderId);

    res.status(200).json({
      success: true,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          mpesaCode: order.mpesaCode,
        },
        payment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .select('orderNumber totalAmount paymentStatus paymentMethod mpesaCode createdAt')
      .sort({ createdAt: -1 });

    const payments = await Payment.find({ userId: req.user.id })
      .populate('orderId', 'orderNumber totalAmount')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        orders,
        payments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Verify payment (Admin only)
// @route   PUT /api/payments/verify/:orderId
// @access  Private/Admin
exports.verifyPayment = async (req, res) => {
  const { action, rejectionReason } = req.body; // action: 'confirm' or 'reject'

  try {
    // Find the payment
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.paymentStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been processed',
      });
    }

    // Update payment status
    if (action === 'confirm') {
      payment.paymentStatus = 'Confirmed';
      payment.verifiedBy = req.user.id;
      payment.verifiedAt = new Date();

      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }
    } else if (action === 'reject') {
      payment.paymentStatus = 'Rejected';
      payment.verifiedBy = req.user.id;
      payment.verifiedAt = new Date();
      payment.rejectionReason = rejectionReason || 'Payment rejected by admin';

      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'failed';
        order.status = 'cancelled';
        await order.save();
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "confirm" or "reject"',
      });
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment ${action}ed successfully`,
      data: {
        payment,
        orderId: payment.orderId
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
  try {
    const filters = {
      verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const payments = await getAllPayments(filters);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get payment statistics (Admin only)
// @route   GET /api/payments/stats
// @access  Private/Admin
exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await getPaymentStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


