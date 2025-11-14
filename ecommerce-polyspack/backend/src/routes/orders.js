import express from 'express';
import { body } from 'express-validator';
import {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  downloadInvoice,
} from '../controllers/orderController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// @desc    Get logged in user orders
// @route   GET /api/orders/me
// @access  Private
router.get('/me', getMyOrders);

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', authorize('admin'), getOrders);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  [
    body('products', 'Products array is required').isArray({ min: 1 }),
    body('products.*.product', 'Product ID is required').isMongoId(),
    body('products.*.quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
    body('deliveryType', 'Delivery type is required').isIn(['Delivery', 'Pickup']),
    body('location').optional().isString(),
  ],
  createOrder
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', getOrder);

// @desc    Download order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
router.get('/:id/invoice', downloadInvoice);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;