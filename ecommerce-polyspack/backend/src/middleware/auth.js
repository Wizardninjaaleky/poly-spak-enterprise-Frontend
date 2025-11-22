import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  console.log('[Protect Middleware] Incoming request to:', req.originalUrl);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('[Protect Middleware] Token found');
  }

  // Make sure token exists
  if (!token) {
    console.log('[Protect Middleware] No token found in request');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Protect Middleware] Token verified, user id:', decoded.id);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log('[Protect Middleware] User not found for token id:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
    next();
  } catch (err) {
    console.log('[Protect Middleware] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('[Authorize Middleware] User role:', req.user.role, 'Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.log('[Authorize Middleware] Access denied for role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
