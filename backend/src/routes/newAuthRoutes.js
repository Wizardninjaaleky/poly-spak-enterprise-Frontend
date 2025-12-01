import express from 'express';
import { register, login, forgotPassword, verifyResetCode, resetPassword, getCurrentUser, logout } from '../controllers/newAuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateInput } from '../middleware/security.js';
import { registerSchema, loginSchema, resetPasswordSchema } from '../validators/schemas.js';

const router = express.Router();

// Public routes with validation
router.post('/register', validateInput(registerSchema), register);
router.post('/login', validateInput(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

export default router;
