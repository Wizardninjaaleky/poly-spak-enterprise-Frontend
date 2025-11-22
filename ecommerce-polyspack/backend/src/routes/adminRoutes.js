const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'sales', 'content', 'support'));

// User management routes
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', authorize('admin'), adminController.updateUserRole);
router.put('/users/:id/status', authorize('admin'), adminController.updateUserStatus);

// Product management routes
router.get('/products', adminController.getProducts);
router.post('/products', authorize('admin', 'content'), upload.array('images', 10), adminController.createProduct);
router.put('/products/:id', authorize('admin', 'content'), upload.array('images', 10), adminController.updateProduct);
router.delete('/products/:id', authorize('admin', 'content'), adminController.deleteProduct);

// Category management routes
router.get('/categories', adminController.getCategories);
router.post('/categories', authorize('admin', 'content'), adminController.createCategory);
router.put('/categories/:id', authorize('admin', 'content'), adminController.updateCategory);
router.delete('/categories/:id', authorize('admin', 'content'), adminController.deleteCategory);

// Order management routes
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', authorize('admin', 'sales'), adminController.updateOrderStatus);

// Payment management routes
router.get('/payments', adminController.getPayments);
router.put('/payments/:id/verify', authorize('admin', 'sales'), adminController.verifyPayment);

// Analytics routes
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
