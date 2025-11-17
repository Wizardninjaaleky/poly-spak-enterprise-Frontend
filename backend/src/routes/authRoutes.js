import express from 'express';
import { register, login, getMe, createAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// TEMP: create admin (once) — after creating admin remove or protect it
router.post('/create-admin', createAdmin);

export default router;
