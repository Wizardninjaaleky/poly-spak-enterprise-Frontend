import WebsiteSettings from '../models/WebsiteSettings.js';

// @desc    Get website settings
// @route   GET /api/website/settings
// @access  Public
export const getWebsiteSettings = async (req, res) => {
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
