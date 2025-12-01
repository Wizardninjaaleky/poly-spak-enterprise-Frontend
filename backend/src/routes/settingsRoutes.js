import express from 'express';
import { getSettings, updateSettings, uploadBrandingImage, deleteBrandingImage, upload } from '../controllers/settingsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get settings (public or authenticated)
router.get('/', getSettings);

// Update settings (admin only)
router.post('/', authMiddleware, adminMiddleware, updateSettings);

// Upload logo or favicon (admin only)
router.post('/upload', authMiddleware, adminMiddleware, upload.single('file'), uploadBrandingImage);

// Delete logo or favicon (admin only)
router.delete('/:type', authMiddleware, adminMiddleware, deleteBrandingImage);

export default router;
