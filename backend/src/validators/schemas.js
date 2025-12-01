import Joi from 'joi';

// Password validation schema - Enterprise grade
export const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 128 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'any.required': 'Password is required'
  });

// Registration validation schema
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must not exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must not exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^(\+254|0)[17]\d{8}$/).required().messages({
    'string.pattern.base': 'Please provide a valid Kenyan phone number',
    'any.required': 'Phone number is required'
  }),
  password: passwordSchema,
  company: Joi.string().max(100).optional(),
  accountType: Joi.string().valid('personal', 'business').default('personal')
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Update profile validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^(\+254|0)[17]\d{8}$/).optional(),
  company: Joi.string().max(100).optional(),
  address: Joi.object({
    street: Joi.string().max(200).optional(),
    city: Joi.string().max(100).optional(),
    county: Joi.string().max(100).optional(),
    country: Joi.string().max(100).optional()
  }).optional()
});

// Password reset validation schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: passwordSchema
});

// Order creation validation schema
export const createOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^(\+254|0)[17]\d{8}$/).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    county: Joi.string().optional(),
    postalCode: Joi.string().optional()
  }).required(),
  totalAmount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('mpesa', 'bank', 'cash').required(),
  customerEmail: Joi.string().email().required(),
  notes: Joi.string().max(500).optional()
});

// Product creation validation schema
export const createProductSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().valid(
    'Seedling Bags',
    'Services',
    'Electronics',
    'Packaging',
    'Fertilizers',
    'Agricultural',
    'Industrial'
  ).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  sku: Joi.string().max(50).optional(),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  specifications: Joi.string().max(1000).optional(),
  weight: Joi.number().positive().optional(),
  dimensions: Joi.object({
    length: Joi.number().positive().optional(),
    width: Joi.number().positive().optional(),
    height: Joi.number().positive().optional()
  }).optional(),
  featured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

// Payment submission validation schema
export const submitPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  paymentMethod: Joi.string().valid('mpesa', 'bank', 'cash').required(),
  transactionId: Joi.string().when('paymentMethod', {
    is: Joi.string().valid('mpesa', 'bank'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  amount: Joi.number().positive().required(),
  phoneNumber: Joi.string().pattern(/^(\+254|0)[17]\d{8}$/).when('paymentMethod', {
    is: 'mpesa',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  proofOfPayment: Joi.string().uri().optional()
});

export default {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  resetPasswordSchema,
  createOrderSchema,
  createProductSchema,
  submitPaymentSchema,
  passwordSchema
};
