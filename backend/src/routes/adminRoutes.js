import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getUsers, getUser, updateUser, deleteUser,
  createCoupon, getCoupons, updateCoupon, deleteCoupon,
  createFlashSale, getFlashSales, updateFlashSale, deleteFlashSale,
  getAnalytics
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes should be protected and authorized for 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.route('/users').get(getUsers);
router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/coupons').post(createCoupon).get(getCoupons);
router.route('/coupons/:id').put(updateCoupon).delete(deleteCoupon);
router.route('/flashsales').post(createFlashSale).get(getFlashSales);
router.route('/flashsales/:id').put(updateFlashSale).delete(deleteFlashSale);
router.route('/analytics').get(getAnalytics);

export default router;