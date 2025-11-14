import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';

router
  .route('/products')
  .get(getProducts)
  .post(
    protect,
    authorize('admin'),
    [
      body('name', 'Name is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('category', 'Category is required').isIn(['Seedling Bags', 'Electronics', 'Services']),
      body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    ],
    createProduct
  );

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;
