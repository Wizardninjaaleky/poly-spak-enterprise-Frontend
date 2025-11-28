import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('admin'), createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);

export default router;