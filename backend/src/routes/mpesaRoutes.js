import express from 'express';
import {
  initiatePayment,
  mpesaCallback,
  queryPaymentStatus,
  getPayment,
  getPaymentHistory,
} from '../controllers/mpesaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initiate STK Push payment
router.post('/initiate', protect, initiatePayment);

// M-PESA callback (public - called by Safaricom)
router.post('/callback', mpesaCallback);

// Query payment status
router.get('/status/:checkoutRequestId', protect, queryPaymentStatus);

// Get specific payment
router.get('/:paymentId', protect, getPayment);

// Get user's payment history
router.get('/history', protect, getPaymentHistory);

export default router;
