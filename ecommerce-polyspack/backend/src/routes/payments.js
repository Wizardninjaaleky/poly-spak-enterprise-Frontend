import express from 'express';
import { body, param } from 'express-validator';
import {
  submitPayment,
  getOrderPayment,
  getPaymentHistory,
  verifyPaymentAdmin,
  getPayments,
  getPaymentStatsAdmin,
} from '../controllers/paymentController.js';

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';
import { paymentRateLimit } from '../middleware/rateLimit.js';

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
], verifyPaymentAdmin);

router.get('/payments', getPayments);
router.get('/payments/stats', getPaymentStatsAdmin);

export default router;
