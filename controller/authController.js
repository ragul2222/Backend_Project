const userRepository = require('../repository/userRepository');

exports.logout = async (req, res) => {
  try {
    await userRepository.updateUser(req.user.userId, { isActive: false });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

module.exports = exports;
