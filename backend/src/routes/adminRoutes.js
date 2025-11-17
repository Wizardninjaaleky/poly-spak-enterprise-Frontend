import express from 'express';
import { createCategory, getCategories, getUsers, getOrders, updateOrderStatus } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', protect, adminOnly, getCategories);
router.post('/categories', protect, adminOnly, createCategory);

router.get('/users', protect, adminOnly, getUsers);

router.get('/orders', protect, adminOnly, getOrders);
router.put('/orders/:id', protect, adminOnly, updateOrderStatus);

export default router;
