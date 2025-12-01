import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

// API Rate Limiter - General endpoints (100 requests per 15 min)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Authentication Rate Limiter - Strict for login/register (5 attempts per 15 min)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  skipSuccessfulRequests: false,
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Account temporarily locked.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Password Reset Rate Limiter - Very strict (3 attempts per hour)
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset attempts',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// MongoDB query sanitization - prevents NoSQL injection
export const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Potential NoSQL injection attempt detected: ${key}`);
  },
});

// XSS protection - clean user input from malicious scripts
export const xssProtection = xss();

// Input validation helper
export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  next();
};

// Request logging for security monitoring
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  next();
};

// Error handler with security considerations
export const secureErrorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const statusCode = err.statusCode || 500;
  const message = isDevelopment 
    ? err.message 
    : statusCode === 500 
      ? 'Internal server error' 
      : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};

export default {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  sanitizeInput,
  xssProtection,
  validateInput,
  securityHeaders,
  requestLogger,
  secureErrorHandler,
};
