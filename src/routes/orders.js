const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All order routes require authentication

router.get('/me', getMyOrders);

router
  .route('/')
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
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
