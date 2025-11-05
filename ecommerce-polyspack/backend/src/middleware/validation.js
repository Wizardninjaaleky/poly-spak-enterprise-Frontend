const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('passwordHash')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('passwordHash')
    .notEmpty()
    .withMessage('Password is required'),
];

// Product validation rules
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stockQty')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
];

// Order validation rules
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('delivery.type')
    .isIn(['delivery', 'pickup'])
    .withMessage('Delivery type must be either delivery or pickup'),
];

// Coupon validation rules
const validateCoupon = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Code must be 3-20 uppercase letters and numbers'),
  body('type')
    .isIn(['percentage', 'fixed', 'free_shipping'])
    .withMessage('Invalid coupon type'),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Value must be a positive number'),
  body('endsAt')
    .isISO8601()
    .withMessage('Please provide a valid end date'),
];

// Parameter validation
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

const validateCategoryId = [
  param('categoryId')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validateCoupon,
  validateObjectId,
  validateCategoryId,
};
