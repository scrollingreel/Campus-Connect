require('dotenv').config();

const config = {
  port:         process.env.PORT         || 5000,
  mongoURI:     process.env.MONGO_URI    || 'mongodb://localhost:27017/campusconnect',
  jwtSecret:    process.env.JWT_SECRET   || 'campusconnect_secret_key_2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv:      process.env.NODE_ENV     || 'development',
  clientURL:    (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
};

module.exports = config;

