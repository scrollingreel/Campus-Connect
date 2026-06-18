const config   = require('./config');
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const rateLimit = require('express-rate-limit');
const logger   = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes         = require('./routes/auth');
const userRoutes         = require('./routes/users');
const taskRoutes         = require('./routes/tasks');
const announcementRoutes = require('./routes/announcements');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS — strictly restricted to our client URL
const corsOptions = {
  origin: config.clientURL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting to prevent abuse/DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

// Request logger middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// Database connection with dev fallback to MongoMemoryServer
const connectDB = async () => {
  let mongoURI = config.mongoURI;

  if (config.nodeEnv !== 'production' && (!mongoURI || mongoURI.startsWith('mongodb://localhost'))) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      logger.info('Using MongoMemoryServer for developer fallback connection.');
    } catch (err) {
      logger.warn('Could not spin up MongoMemoryServer, falling back to standard local connection.', { error: err.message });
    }
  }

  await mongoose.connect(mongoURI);
  logger.info('MongoDB connected successfully.');
};

connectDB().catch((err) => {
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
