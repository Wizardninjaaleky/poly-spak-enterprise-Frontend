const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    authorize('admin'),
    [
      body('name', 'Name is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('category', 'Category is required').isIn(['Seedling Bags', 'Electronics', 'Services']),
      body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    ],
    createProduct
  );

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
