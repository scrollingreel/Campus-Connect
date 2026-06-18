const jwt      = require('jsonwebtoken');
const config   = require('../config');
const logger   = require('../utils/logger');
const AppError = require('../utils/AppError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized access attempt — no token provided', { ip: req.ip, url: req.originalUrl });
    return next(new AppError('Access denied. No token provided.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Unauthorized access attempt — invalid token', { ip: req.ip, url: req.originalUrl });
    next(err);
  }
};

module.exports = { protect };
