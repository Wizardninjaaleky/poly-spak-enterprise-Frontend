const express = require('express');
const { getWebsiteSettings } = require('../controllers/websiteController');

const router = express.Router();

// Public route to get website settings
router.route('/settings').get(getWebsiteSettings);

module.exports = router;
