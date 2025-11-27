import express from 'express';
import { registerUser as register, loginUser as login, createAdmin } from '../controllers/authController.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Create admin route (temporary, remove after first admin is created)
router.post('/create-admin', createAdmin);

export default router;
