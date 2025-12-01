import express from 'express';
import { 
  getHeroSlides, 
  getActiveHeroSlides, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide 
} from '../controllers/heroSlideController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getHeroSlides);
router.get('/active', getActiveHeroSlides);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createHeroSlide);
router.patch('/:id', authMiddleware, adminMiddleware, updateHeroSlide);
router.delete('/:id', authMiddleware, adminMiddleware, deleteHeroSlide);

export default router;
