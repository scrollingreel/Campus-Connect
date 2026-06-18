const winston = require('winston');
const config = require('../config');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  config.nodeEnv === 'production'
    ? winston.format.json()
    : winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let metaStr = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaStr}`;
      })
);

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [new winston.transports.Console()],
});

module.exports = logger;
