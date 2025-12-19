const userRepository = require('../repository/userRepository');
const Role = require('../models/role');

// Get all active users (admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get single user by id (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Update a user's role (superadmin only via route middleware)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'role is required'
      });
    }

    // Optional: restrict roles to known set
    const allowedRoles = ['user', 'admin', 'superadmin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const updatedUser = await userRepository.updateUserById(
      req.params.id,
      { role, updatedBy: req.user.role }
    );

    return res.status(200).json({
      success: true,
      message: 'User role updated',
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Set permissions for a role (superadmin only)
exports.updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const roleName = req.params.role; // e.g., 'admin'

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: 'permissions must be an array of strings'
      });
    }

    // Upsert role with new permissions
    const roleDoc = await Role.findOneAndUpdate(
      { name: roleName },
      { name: roleName, permissions },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Role permissions updated',
      data: roleDoc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    await userRepository.softDeleteUser(req.params.id, req.user.role);

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Cannot delete admin user') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
