import Order from '../models/Order.js'; // Assuming these models exist
import Product from '../models/Product.js'; // Assuming these models exist
import Coupon from '../models/Coupon.js'; // Assuming these models exist
import User from '../models/User.js'; // Assuming these models exist
import { validationResult } from 'express-validator'; // Assuming express-validator is used
import { generateInvoice } from '../services/invoiceService.js'; // Assuming this service exists

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .populate('couponId', 'code value type');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .populate('couponId', 'code value type');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user owns order or is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/me
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price images')
      .populate('couponId', 'code value type');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { items, delivery, couponCode } = req.body;

  try {
    let totalAmount = 0;
    let couponId = null;
    let discountAmount = 0;

    // Calculate total and validate items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
      const price = product.discountedPrice || product.price;
      totalAmount += price * item.qty;
      orderItems.push({ productId: item.productId, qty: item.qty, price });
    }

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code',
        });
      }
      // Assuming isExpired and isUsageLimitReached are methods on the Coupon model
      if ((coupon.isExpired && coupon.isExpired()) || (coupon.isUsageLimitReached && coupon.isUsageLimitReached())) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not valid',
        });
      }

      // Apply discount
      if (coupon.type === 'percentage') {
        discountAmount = totalAmount * (coupon.value / 100);
      } else {
        discountAmount = coupon.value;
      }
      totalAmount = Math.max(totalAmount - discountAmount, 0); // Ensure total doesn't go negative
      couponId = coupon._id;
      coupon.usedCount += 1;
      await coupon.save();
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      discountAmount,
      delivery,
      couponId,
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Download invoice for order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user owns order or is admin
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to download this invoice',
      });
    }

    // Check if payment is confirmed
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice is only available for paid orders',
      });
    }

    // Generate invoice PDF
    const user = await User.findById(order.userId);
    const pdfBuffer = await generateInvoice(order, user);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Invoice download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};