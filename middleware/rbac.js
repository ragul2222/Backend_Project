const Role = require('../models/role');

// Check if user has required role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient privileges.'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Role check failed'
      });
    }
  };
};

// Check if user has required permission via Role document
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const roleName = req.user.role;
      const role = await Role.findOne({ name: roleName });

      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Role not found'
        });
      }

      if (!role.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

const isAdmin = checkRole('admin', 'superadmin');
const isSuperAdmin = checkRole('superadmin');

module.exports = { checkRole, isAdmin, isSuperAdmin, checkPermission };
