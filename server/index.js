const config   = require('./config');
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const logger   = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes         = require('./routes/auth');
const userRoutes         = require('./routes/users');
const taskRoutes         = require('./routes/tasks');
const announcementRoutes = require('./routes/announcements');

const app = express();

// CORS — whitelist deployed frontend in production
const corsOptions = {
  origin: config.nodeEnv === 'production'
    ? [config.clientURL]
    : '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

mongoose
  .connect(config.mongoURI)
  .then(() => logger.info('MongoDB connected successfully.'))
  .catch((err) => {
    logger.error('MongoDB connection error', { error: err.message });
    process.exit(1);
  });

app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/tasks',         taskRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'CampusConnect API is running.',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`CampusConnect API running on http://localhost:${config.port}`);
});
