// RBAC middleware for Polyspack
module.exports = function rbac(roles = []) {
  // roles param can be a single role string (e.g. 'admin') or array of roles
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires role(s): ${roles.join(', ')}`,
      });
    }
    next();
  };
};
