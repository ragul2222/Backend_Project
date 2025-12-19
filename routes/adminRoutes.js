const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController');
const { verifyToken } = require('../middleware/auth');
const { isAdmin, isSuperAdmin, checkPermission } = require('../middleware/rbac');

router.get(
  '/users',
  verifyToken,
  isAdmin,
  checkPermission('VIEW_USERS'),
  adminController.getUsers
);

router.delete(
  '/users/:id',
  verifyToken,
  isAdmin,
  checkPermission('DELETE_USER'),
  adminController.softDeleteUser
);

router.patch(
  '/users/:id/role',
  verifyToken,
  isSuperAdmin,
  adminController.updateUserRole
);

router.patch(
  '/roles/:role/permissions',
  verifyToken,
  isSuperAdmin,
  adminController.updateRolePermissions
);

module.exports = router;
