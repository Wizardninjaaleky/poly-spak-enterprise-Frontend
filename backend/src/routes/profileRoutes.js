import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  changePassword,
  upload
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Get current user profile
router.get('/', getProfile);

// Update profile information
router.put('/', updateProfile);

// Upload profile photo
router.post('/photo', upload.single('profilePhoto'), uploadProfilePhoto);

// Delete profile photo
router.delete('/photo', deleteProfilePhoto);

// Change password
router.put('/password', changePassword);

export default router;
