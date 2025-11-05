const rateLimit = require('express-rate-limit');

// Rate limiter for payment submissions
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 payment submissions per windowMs
  message: {
    success: false,
    message: 'Too many payment submissions from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for admin users (optional)
  skip: (req, res) => {
    return req.user && req.user.role === 'admin';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many payment submissions from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// General API rate limiter
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for sensitive operations
const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    success: false,
    message: 'Too many sensitive operations from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  paymentRateLimit,
  generalRateLimit,
  strictRateLimit
};
