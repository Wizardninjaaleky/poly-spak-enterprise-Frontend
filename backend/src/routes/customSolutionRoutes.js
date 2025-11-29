import express from 'express';
import * as customSolutionController from '../controllers/customSolutionController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/custom-solutions - Submit new quote request
router.post(
  '/',
  upload.array('files', 5), // Max 5 files
  customSolutionController.createQuoteRequest
);

// GET /api/custom-solutions - Get all quote requests (Admin only)
router.get(
  '/',
  customSolutionController.getAllQuoteRequests
);

// GET /api/custom-solutions/:id - Get specific quote request
router.get(
  '/:id',
  customSolutionController.getQuoteRequestById
);

// PATCH /api/custom-solutions/:id - Update quote status (Admin only)
router.patch(
  '/:id',
  customSolutionController.updateQuoteStatus
);

// POST /api/custom-solutions/:id/notes - Add note to quote (Admin only)
router.post(
  '/:id/notes',
  customSolutionController.addNote
);

export default router;
