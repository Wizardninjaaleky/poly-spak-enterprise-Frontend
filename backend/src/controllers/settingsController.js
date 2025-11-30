import WebsiteSettings from '../models/WebsiteSettings.js';

// Get website settings
export const getSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await WebsiteSettings.create({
        contactPhone: '+254 742 312306',
        contactEmail: 'info@polyspackenterprises.co.ke',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
          tiktok: '',
          whatsapp: '254742312306',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
};

// Update website settings (admin only)
export const updateSettings = async (req, res) => {
  try {
    const { contactPhone, contactEmail, socialMedia } = req.body;

    // Validate required fields
    if (!contactPhone || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Contact phone and email are required',
      });
    }

    // Find existing settings or create new
    let settings = await WebsiteSettings.findOne();
    
    if (settings) {
      // Update existing settings
      settings.contactPhone = contactPhone;
      settings.contactEmail = contactEmail;
      settings.socialMedia = socialMedia;
      settings.updatedAt = Date.now();
      await settings.save();
    } else {
      // Create new settings
      settings = await WebsiteSettings.create({
        contactPhone,
        contactEmail,
        socialMedia,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message,
    });
  }
};
