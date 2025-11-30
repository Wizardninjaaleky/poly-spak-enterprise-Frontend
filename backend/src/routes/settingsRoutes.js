import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get settings (public or authenticated)
router.get('/', getSettings);

// Update settings (admin only)
router.post('/', authMiddleware, adminMiddleware, updateSettings);

export default router;
