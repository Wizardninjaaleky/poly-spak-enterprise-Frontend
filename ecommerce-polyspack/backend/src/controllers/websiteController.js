const WebsiteSettings = require('../models/WebsiteSettings');

// @desc    Get website settings
// @route   GET /api/website/settings
// @access  Public
exports.getWebsiteSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
