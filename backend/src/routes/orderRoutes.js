import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getOrders, getOrder, getMyOrders, createOrder, updateOrderStatus, downloadInvoice
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/').get(authorize('admin'), getOrders).post(createOrder);
router.route('/me').get(getMyOrders);
router.route('/:id').get(getOrder);
router.route('/:id/status').put(authorize('admin'), updateOrderStatus);
router.route('/:id/invoice').get(downloadInvoice);

export default router;