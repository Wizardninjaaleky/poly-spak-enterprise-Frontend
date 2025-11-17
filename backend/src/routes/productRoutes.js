import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  summary
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', protect, summary);

router.route('/')
  .get(protect, getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
