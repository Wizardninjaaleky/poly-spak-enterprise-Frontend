import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import productUpload from '../middleware/productUpload.js';

const router = express.Router();

// Image upload endpoint
router.post('/upload-images', protect, authorize('admin'), productUpload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Generate URLs for uploaded images
    const imageUrls = req.files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
    });

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: imageUrls,
      count: imageUrls.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

router.route('/').get(getProducts).post(protect, authorize('admin'), createProduct);
router.route('/:id').get(getProduct).put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);

export default router;