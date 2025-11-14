import express from 'express';
import { getWebsiteSettings } from '../controllers/websiteController.js';

const router = express.Router();

// Public route to get website settings
router.route('/settings').get(getWebsiteSettings);

export default router;
