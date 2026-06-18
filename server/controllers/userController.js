const bcrypt  = require('bcrypt');
const logger  = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const User    = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ registrationDate: -1 });
    logger.info('Users list retrieved', { count: users.length });
    sendSuccess(res, 200, 'Users retrieved successfully.', { count: users.length, users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }
    sendSuccess(res, 200, 'User retrieved successfully.', { user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const updates = {};
    if (name)  updates.name  = name.trim();
    if (email) updates.email = email.toLowerCase().trim();

    if (password) {
      if (password.length < 8) {
        return sendError(res, 400, 'Password must be at least 8 characters.');
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    logger.info('User profile updated', { userId: user._id });
    sendSuccess(res, 200, 'Profile updated successfully.', { user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(' ');
      return sendError(res, 400, msg);
    }
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }
    logger.info('User deleted', { userId: req.params.id });
    sendSuccess(res, 200, 'User deleted successfully.', {});
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
