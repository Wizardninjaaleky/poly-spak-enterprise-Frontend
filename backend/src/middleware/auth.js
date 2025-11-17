import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) return res.status(401).json({ message: 'Not authorized' });
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: 'Not authorized, token missing' });
  } catch (err) {
    console.error('AUTH ERROR:', err.message);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export const admin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin resource. Access denied.' });
  next();
};
