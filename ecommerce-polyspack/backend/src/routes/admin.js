const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const {
  getUsers,
  updateUserRole,
  updateUserStatus,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getPayments,
  verifyPayment,
  getAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['admin']));

// User management routes
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);

// Product management routes
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management routes
router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Payment management routes
router.get('/payments', getPayments);
router.put('/payments/:id/verify', verifyPayment);

// Category management routes
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Analytics routes
router.get('/analytics', getAnalytics);

module.exports = router;
