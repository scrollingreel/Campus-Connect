require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (nodeEnv === 'production') {
    console.error('FATAL ERROR: JWT_SECRET environment variable is not defined in production.');
    process.exit(1);
  } else {
    console.warn('WARNING: JWT_SECRET environment variable is not defined. Using insecure fallback secret key.');
    jwtSecret = 'campusconnect_secret_key_2025';
  }
}

const config = {
  port:         process.env.PORT         || 5000,
  mongoURI:     process.env.MONGO_URI    || 'mongodb://localhost:27017/campusconnect',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv,
  clientURL:    (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
};

module.exports = config;

