import mpesaService from '../services/mpesaService.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

/**
 * @desc    Initiate M-PESA STK Push payment
 * @route   POST /api/payments/mpesa/initiate
 * @access  Private
 */
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;

    // Validate inputs
    if (!orderId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and phone number are required',
      });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check order ownership
    if (order.userId.toString() !== req.user.id && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order',
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order is already paid',
      });
    }

    // Initiate STK Push
    const stkPushResponse = await mpesaService.initiateSTKPush(
      phoneNumber,
      order.totalAmount,
      order.orderNumber || order._id.toString(),
      `Payment for Order ${order.orderNumber || order._id}`
    );

    if (!stkPushResponse.success) {
      return res.status(400).json({
        success: false,
        message: stkPushResponse.message || 'Failed to initiate payment',
        error: stkPushResponse.error,
      });
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      userId: req.user.id || req.user._id,
      amount: order.totalAmount,
      phoneNumber,
      paymentMethod: 'mpesa',
      paymentStatus: 'Pending',
      checkoutRequestId: stkPushResponse.CheckoutRequestID,
      merchantRequestId: stkPushResponse.MerchantRequestID,
      transactionStatus: 'initiated',
    });

    await payment.save();

    // Update order status
    order.paymentStatus = 'awaiting';
    await order.save();

    res.status(200).json({
      success: true,
      message: stkPushResponse.CustomerMessage || 'Payment request sent to your phone',
      data: {
        CheckoutRequestID: stkPushResponse.CheckoutRequestID,
        MerchantRequestID: stkPushResponse.MerchantRequestID,
        paymentId: payment._id,
        orderId: order._id,
      },
    });
  } catch (error) {
    console.error('M-PESA initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

/**
 * @desc    M-PESA STK Push callback handler
 * @route   POST /api/payments/mpesa/callback
 * @access  Public (called by Safaricom)
 */
export const mpesaCallback = async (req, res) => {
  try {
    console.log('M-PESA Callback received:', JSON.stringify(req.body, null, 2));

    // Process callback
    const callbackData = mpesaService.processCallback(req.body);

    // Find payment by CheckoutRequestID
    const payment = await Payment.findOne({
      checkoutRequestId: callbackData.CheckoutRequestID,
    });

    if (!payment) {
      console.error('Payment not found for CheckoutRequestID:', callbackData.CheckoutRequestID);
      return res.status(404).json({
        ResultCode: 1,
        ResultDesc: 'Payment record not found',
      });
    }

    if (callbackData.success) {
      // Payment successful
      payment.paymentStatus = 'Verified';
      payment.transactionStatus = 'completed';
      payment.mpesaCode = callbackData.MpesaReceiptNumber;
      payment.transactionDate = new Date(callbackData.TransactionDate);
      payment.verifiedAt = new Date();

      await payment.save();

      // Update order
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'processing';
        order.mpesaCode = callbackData.MpesaReceiptNumber;
        await order.save();
      }

      console.log('Payment verified successfully:', callbackData.MpesaReceiptNumber);
    } else {
      // Payment failed
      payment.paymentStatus = 'Failed';
      payment.transactionStatus = 'failed';
      payment.failureReason = callbackData.ResultDesc;
      await payment.save();

      // Update order
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }

      console.log('Payment failed:', callbackData.ResultDesc);
    }

    // Respond to Safaricom
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('M-PESA callback processing error:', error);
    res.status(200).json({
      ResultCode: 1,
      ResultDesc: 'Callback processing failed',
    });
  }
};

/**
 * @desc    Query M-PESA payment status
 * @route   GET /api/payments/mpesa/status/:checkoutRequestId
 * @access  Private
 */
export const queryPaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    // Find payment
    const payment = await Payment.findOne({ checkoutRequestId }).populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check ownership
    if (payment.userId.toString() !== req.user.id && payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Query M-PESA if payment is still pending
    if (payment.paymentStatus === 'Pending') {
      const statusResponse = await mpesaService.querySTKPushStatus(checkoutRequestId);
      
      if (statusResponse.success && statusResponse.ResultCode === '0') {
        // Payment completed - update records
        payment.paymentStatus = 'Verified';
        payment.transactionStatus = 'completed';
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          await order.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        orderId: payment.orderId._id,
        orderNumber: payment.orderId.orderNumber,
        amount: payment.amount,
        phoneNumber: payment.phoneNumber,
        paymentStatus: payment.paymentStatus,
        transactionStatus: payment.transactionStatus,
        mpesaCode: payment.mpesaCode,
        checkoutRequestId: payment.checkoutRequestId,
        createdAt: payment.createdAt,
        verifiedAt: payment.verifiedAt,
      },
    });
  } catch (error) {
    console.error('Query payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to query payment status',
      error: error.message,
    });
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/mpesa/:paymentId
 * @access  Private
 */
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('orderId', 'orderNumber totalAmount items shippingAddress')
      .populate('userId', 'firstName lastName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check ownership or admin
    if (
      payment.userId._id.toString() !== req.user.id &&
      payment.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's payment history
 * @route   GET /api/payments/mpesa/history
 * @access  Private
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user.id || req.user._id,
    })
      .populate('orderId', 'orderNumber totalAmount createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message,
    });
  }
};
