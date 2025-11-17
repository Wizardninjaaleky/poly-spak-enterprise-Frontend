import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  getUsers,
  getOrders,
  updateOrderStatus,
  uploadProductImage,
  uploadLogo,
  updateWebsiteSettings
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Product routes
router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Category routes
router.route('/categories')
  .get(getCategories)
  .post(createCategory);

// User routes
router.route('/users')
  .get(getUsers);

// Order routes
router.route('/orders')
  .get(getOrders);

router.route('/orders/:id')
  .put(updateOrderStatus);

// Upload routes
router.post('/upload/product-image', uploadSingle('image'), uploadProductImage);
router.post('/upload/logo', uploadSingle('logo'), uploadLogo);

// Website settings
router.put('/website-settings', updateWebsiteSettings);

export default router;
