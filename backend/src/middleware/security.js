import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Temporary: Simplified rate limiters (no-op middleware)
// TODO: Re-enable express-rate-limit once deployment issues are resolved
export const apiLimiter = (req, res, next) => next();
export const authLimiter = (req, res, next) => next();
export const passwordResetLimiter = (req, res, next) => next();

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
