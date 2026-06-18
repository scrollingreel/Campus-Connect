const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const config  = require('../config');
const logger  = require('../utils/logger');
const AppError              = require('../utils/AppError');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const User    = require('../models/User');

const SALT_ROUNDS = 10;

const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'All fields are required.');
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return sendError(res, 409, 'Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = signToken(user);

    logger.info('New user registered', { userId: user._id, email: user.email });

    sendSuccess(res, 201, 'Registration successful.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, registrationDate: user.registrationDate },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(' ');
      return sendError(res, 400, msg);
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      logger.warn('Login attempt with unknown email', { email });
      return sendError(res, 401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login attempt with wrong password', { email });
      return sendError(res, 401, 'Invalid email or password.');
    }

    const token = signToken(user);

    logger.info('User logged in', { userId: user._id, email: user.email });

    sendSuccess(res, 200, 'Login successful.', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, registrationDate: user.registrationDate },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
