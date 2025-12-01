import WebsiteSettings from '../models/WebsiteSettings.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for logo/favicon uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/branding');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileType = req.body.type || 'logo'; // 'logo' or 'favicon'
    const uniqueSuffix = Date.now();
    cb(null, fileType + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter
});

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

/**
 * @desc    Upload logo or favicon
 * @route   POST /api/settings/upload
 * @access  Private (Admin only)
 */
export const uploadBrandingImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { type } = req.body; // 'logo' or 'favicon'
    
    if (!type || !['logo', 'favicon'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "logo" or "favicon"',
      });
    }

    let settings = await WebsiteSettings.findOne();
    
    if (!settings) {
      settings = await WebsiteSettings.create({
        contactPhone: '+254 742 312306',
        contactEmail: 'info@polyspackenterprises.co.ke',
      });
    }

    // Delete old file if exists
    const oldFile = type === 'logo' ? settings.logo : settings.favicon;
    if (oldFile) {
      const oldFilePath = path.join(__dirname, '../..', oldFile);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update settings with new file path
    const filePath = `/uploads/branding/${req.file.filename}`;
    if (type === 'logo') {
      settings.logo = filePath;
    } else {
      settings.favicon = filePath;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: `${type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`,
      data: {
        [type]: filePath,
      },
    });
  } catch (error) {
    console.error('Upload branding image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete logo or favicon
 * @route   DELETE /api/settings/:type
 * @access  Private (Admin only)
 */
export const deleteBrandingImage = async (req, res) => {
  try {
    const { type } = req.params; // 'logo' or 'favicon'
    
    if (!['logo', 'favicon'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "logo" or "favicon"',
      });
    }

    const settings = await WebsiteSettings.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found',
      });
    }

    const file = type === 'logo' ? settings.logo : settings.favicon;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: `No ${type} to delete`,
      });
    }

    // Delete file
    const filePath = path.join(__dirname, '../..', file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from database
    if (type === 'logo') {
      settings.logo = null;
    } else {
      settings.favicon = null;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: `${type === 'logo' ? 'Logo' : 'Favicon'} deleted successfully`,
    });
  } catch (error) {
    console.error('Delete branding image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};
