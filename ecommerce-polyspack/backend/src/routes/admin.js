import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminProducts,
  updateProfile,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  createFlashSale,
  getFlashSales,
  updateFlashSale,
  deleteFlashSale,
  getAnalytics,
  getOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';

const router = express.Router();

import { protect, authorize } from '../middleware/auth.js';

// All admin routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// User management
router.route('/users').get(getUsers);
router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

// Category management
router
  .route('/categories')
  .get(getCategories)
  .post(
    [
      body('name', 'Category name is required').not().isEmpty(),
      body('description', 'Category description is required').not().isEmpty(),
    ],
    createCategory
  );
router.route('/categories/:id').get(getCategory).put(updateCategory).delete(deleteCategory);

// Product management
router.route('/products').get(getAdminProducts);

// Profile management
router.route('/profile').put(updateProfile);

// Coupon management
router
  .route('/coupons')
  .get(getCoupons)
  .post(
    [
      body('code', 'Coupon code is required').not().isEmpty(),
      body('type', 'Type must be percentage or fixed').isIn(['percentage', 'fixed']),
      body('value', 'Value must be a positive number').isFloat({ min: 0 }),
    ],
    createCoupon
  );
router.route('/coupons/:id').put(updateCoupon).delete(deleteCoupon);

// Flash sale management
router
  .route('/flashsales')
  .get(getFlashSales)
  .post(
    [
      body('title', 'Title is required').not().isEmpty(),
      body('discount', 'Discount must be between 0 and 100').isFloat({ min: 0, max: 100 }),
      body('startDate', 'Start date is required').isISO8601(),
      body('endDate', 'End date is required').isISO8601(),
    ],
    createFlashSale
  );
router.route('/flashsales/:id').put(updateFlashSale).delete(deleteFlashSale);

// Analytics
router.route('/analytics').get(getAnalytics);

// Order management
router.route('/orders').get(getOrders);
router.route('/orders/:id').put(
  [
    body('status', 'Status must be one of: pending, processing, shipped, delivered, cancelled').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  ],
  updateOrderStatus
);

export default router;
