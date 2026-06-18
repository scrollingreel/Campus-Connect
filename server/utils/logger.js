const formatMessage = (level, message, meta) => {
  const ts = new Date().toISOString();
  let line = `[${ts}] [${level}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    line += ` ${JSON.stringify(meta)}`;
  }
  return line;
};

const logger = {
  info(message, meta) {
    console.log(formatMessage('INFO', message, meta));
  },
  warn(message, meta) {
    console.warn(formatMessage('WARN', message, meta));
  },
  error(message, meta) {
    console.error(formatMessage('ERROR', message, meta));
  },
};

module.exports = logger;
