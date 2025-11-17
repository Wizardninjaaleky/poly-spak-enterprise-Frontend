import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);

router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
