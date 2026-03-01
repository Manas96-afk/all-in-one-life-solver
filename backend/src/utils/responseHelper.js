/**
 * Response Helper Utility
 * Standardizes API responses across the application
 */

const logger = require('./logger');

/**
 * Send successful response
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  // Add pagination info if data has pagination
  if (data && data.pagination) {
    response.pagination = data.pagination;
    response.data = data.items || data.data;
  }

  logger.info(`Success Response: ${message}`, { statusCode, dataType: typeof data });
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} error - Additional error details
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  // Add error details in development mode
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = {
      details: error.message || error,
      stack: error.stack
    };
  }

  // Add error code if available
  if (error && error.code) {
    response.errorCode = error.code;
  }

  logger.error(`Error Response: ${message}`, { 
    statusCode, 
    error: error?.message || error,
    stack: error?.stack 
  });
  
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array|Object} validationErrors - Validation error details
 * @param {string} message - Error message
 */
const sendValidationError = (res, validationErrors, message = 'Validation failed') => {
  const response = {
    success: false,
    message,
    validationErrors,
    timestamp: new Date().toISOString()
  };

  logger.warn(`Validation Error: ${message}`, { validationErrors });
  return res.status(400).json(response);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Resource that was not found
 */
const sendNotFound = (res, resource = 'Resource') => {
  const message = `${resource} not found`;
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  logger.warn(`Not Found: ${message}`);
  return res.status(404).json(response);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send no content response
 * @param {Object} res - Express response object
 */
const sendNoContent = (res) => {
  logger.info('No Content Response');
  return res.status(204).send();
};

/**
 * Handle async route errors
 * @param {Function} fn - Async function to wrap
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendCreated,
  sendNoContent,
  asyncHandler
};