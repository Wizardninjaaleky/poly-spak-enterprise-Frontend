const express = require('express');
const { body, param } = require('express-validator');
const {
  submitPayment,
  getOrderPayment,
  getPaymentHistory,
  verifyPayment,
  getPayments,
  getPaymentStats,
} = require('../controllers/paymentController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { paymentRateLimit } = require('../middleware/rateLimit');

// All payment routes require authentication
router.use(protect);

// User payment routes
router.post(
  '/submit',
  paymentRateLimit,
  [
    body('orderId', 'Order ID is required').isMongoId(),
    body('amount', 'Amount is required').isFloat({ min: 0 }),
    body('phoneNumber', 'Phone number is required').isMobilePhone('any'),
    body('mpesaCode', 'M-Pesa code is required').not().isEmpty().isLength({ min: 10, max: 15 }),
  ],
  submitPayment
);

router.get('/order/:orderId', [
  param('orderId', 'Invalid order ID').isMongoId(),
], getOrderPayment);

router.get('/history', getPaymentHistory);

// Admin only routes
router.use(authorize('admin'));

router.put('/verify/:orderId', [
  param('orderId', 'Invalid order ID').isMongoId(),
  body('action', 'Action is required').isIn(['confirm', 'reject']),
  body('rejectionReason').optional().isString().isLength({ max: 500 }),
], verifyPayment);

router.get('/payments', getPayments);
router.get('/payments/stats', getPaymentStats);

module.exports = router;
