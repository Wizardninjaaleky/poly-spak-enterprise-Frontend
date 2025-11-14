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

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';

router.use(protect); // All order routes require authentication

router.get('/me', getMyOrders);

router
  .route('/orders')
  .get(authorize('admin'), getOrders)
  .post(
    [
      body('products', 'Products array is required').isArray({ min: 1 }),
      body('products.*.product', 'Product ID is required').isMongoId(),
      body('products.*.quantity', 'Quantity must be a positive integer').isInt({ min: 1 }),
      body('deliveryType', 'Delivery type is required').isIn(['Delivery', 'Pickup']),
      body('location').optional().isString(),
    ],
    createOrder
  );

router.get('/:id', getOrder);
router.get('/:id/invoice', downloadInvoice);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
