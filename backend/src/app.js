/**
 * Main Express Application Configuration
 * All-in-One Life Problem Solver Backend
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Import routes
const toolsRoutes = require('./routes/tools');
const guidesRoutes = require('./routes/guides');
const categoriesRoutes = require('./routes/categories');
const contactRoutes = require('./routes/contact');

// Import middleware
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Life Problem Solver API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/tools', toolsRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', contactRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to All-in-One Life Problem Solver API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      guides: '/api/guides',
      categories: '/api/categories',
      contact: '/api/contact',
      health: '/health'
    },
    documentation: 'Visit /api/docs for API documentation'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: ['/api/tools', '/api/guides', '/api/categories', '/api/contact']
  });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;