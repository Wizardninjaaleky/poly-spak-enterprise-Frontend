import express from 'express';
import { body, param } from 'express-validator';
import {
  submitPayment,
  getOrderPayment,
  getPaymentHistory,
  verifyPayment,
  getPayments,
  getPaymentStatsController,
} from '../controllers/paymentController.js';

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';
import { paymentRateLimit } from '../middleware/rateLimit.js';

// All payment routes require authentication
router.use(protect);

// User payment routes
router.post(
  '/payments/submit',
  paymentRateLimit,
  [
    body('orderId', 'Order ID is required').isMongoId(),
    body('amount', 'Amount is required').isFloat({ min: 0 }),
    body('phoneNumber', 'Phone number is required').isMobilePhone('any'),
    body('mpesaCode', 'M-Pesa code is required').not().isEmpty().isLength({ min: 10, max: 15 }),
    body('recaptchaToken', 'reCAPTCHA token is required').not().isEmpty(),
  ],
  submitPayment
);

router.get('/payments/order/:orderId', [
  param('orderId', 'Invalid order ID').isMongoId(),
], getOrderPayment);

router.get('/payments/history', getPaymentHistory);

// Admin only routes
router.use(authorize('admin'));

router.put('/payments/verify/:orderId', [
  param('orderId', 'Invalid order ID').isMongoId(),
  body('action', 'Action is required').isIn(['confirm', 'reject']),
  body('rejectionReason').optional().isString().isLength({ max: 500 }),
], verifyPayment);

router.get('/payments', getPayments);
router.get('/payments/stats', getPaymentStatsController);

export default router;
