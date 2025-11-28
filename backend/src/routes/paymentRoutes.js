import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  submitPayment, getOrderPayment, getPaymentHistory, verifySubmittedPayment, getPayments, getPaymentStats
} from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect); // All payment routes require authentication

router.route('/submit').post(submitPayment);
router.route('/order/:orderId').get(getOrderPayment);
router.route('/history').get(getPaymentHistory);
router.route('/verify/:orderId').put(authorize('admin'), verifySubmittedPayment);
router.route('/').get(authorize('admin'), getPayments);
router.route('/stats').get(authorize('admin'), getPaymentStats);

export default router;