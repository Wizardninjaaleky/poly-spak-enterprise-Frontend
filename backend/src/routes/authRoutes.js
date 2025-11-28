import express from 'express';
import {
  registerUser, loginUser, getMe, createAdmin,
  updateDetails, updatePassword, logout, forgotPassword, resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getMe);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/logout').get(protect, logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/create-admin').post(createAdmin); // TEMP: protect or remove after initial setup

export default router;
