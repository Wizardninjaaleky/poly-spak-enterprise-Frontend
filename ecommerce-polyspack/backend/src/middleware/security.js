const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security middleware setup
const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/api/', limiter);
};

module.exports = securityMiddleware;
