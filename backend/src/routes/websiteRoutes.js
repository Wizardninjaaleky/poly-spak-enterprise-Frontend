import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getWebsiteSettings } from '../controllers/websiteController.js';

const router = express.Router();

router.route('/settings').get(getWebsiteSettings); // Public route

export default router;