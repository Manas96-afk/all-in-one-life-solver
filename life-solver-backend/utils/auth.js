/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('./logger');

/**
 * Protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (if using MongoDB)
      if (process.env.MONGODB_URI) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'No user found with this token'
          });
        }
        req.user = user;
      } else {
        // If using JSON storage, just attach the decoded user info
        req.user = decoded;
      }

      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during authentication'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (process.env.MONGODB_URI) {
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
          }
        } else {
          req.user = decoded;
        }
      } catch (error) {
        // Token invalid, but continue without user
        logger.warn(`Optional auth token invalid: ${error.message}`);
      }
    }

    next();
  } catch (error) {
    logger.error(`Optional auth middleware error: ${error.message}`);
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
};