const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  downloadInvoice,
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
      body('items', 'Items array is required').isArray({ min: 1 }),
      body('items.*.productId', 'Product ID is required').isMongoId(),
      body('items.*.qty', 'Quantity must be a positive integer').isInt({ min: 1 }),
      body('delivery', 'Delivery object is required').not().isEmpty(),
      body('delivery.type').optional().isIn(['delivery', 'pickup']),
    ],
    createOrder
  );

router.get('/:id', getOrder);
router.get('/:id/invoice', downloadInvoice);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
