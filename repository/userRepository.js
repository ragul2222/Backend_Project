const User = require('../models/user');

exports.findAllUsers = async () => {
  return User.find({ isActive: true }).select('-password');
};

exports.findUserById = async (userId) => {
  return User.findById(userId).select('-password');
};

exports.findUserByEmail = async (email) => {
  return User.findOne({ email });
};

exports.createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

exports.updateUserById = async (userId, updateData) => {
  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  }).select('-password');
};

exports.updateLoginStatus = async (userId, status) => {
  return User.findByIdAndUpdate(userId, { isActive: status }, { new: true });
};

exports.softDeleteUser = async (userId, currentUserRole) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'admin' && currentUserRole !== 'superadmin') {
    throw new Error('Cannot delete admin user');
  }

  user.isActive = false;
  return user.save();
};
