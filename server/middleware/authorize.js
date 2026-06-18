/**
 * Role-Based Authorization Middleware (TODO 7)
 *
 * Must be used AFTER the `protect` middleware, which attaches req.user.
 * Accepts one or more allowed roles and rejects requests from users
 * whose role is not in the allowed list.
 *
 * Usage:
 *   const { protect } = require('./auth');
 *   const authorize   = require('./authorize');
 *
 *   router.delete('/users/:id', protect, authorize('admin'), deleteUser);
 *   router.post('/announcements', protect, authorize('faculty', 'admin'), createAnnouncement);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // protect middleware must run first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role "${req.user.role}" is not authorized to access this resource.`,
      });
    }

    next();
  };
};

module.exports = authorize;
