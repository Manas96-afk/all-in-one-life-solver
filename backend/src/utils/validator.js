/**
 * Basic Validation Utility
 * Provides common validation functions for the application
 */

const Joi = require('joi');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate contact form data
 * @param {Object} data - Contact form data
 * @returns {Object} - Validation result
 */
const validateContactForm = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,20}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    
    subject: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Subject must be at least 5 characters long',
        'string.max': 'Subject cannot exceed 200 characters',
        'any.required': 'Subject is required'
      }),
    
    message: Joi.string()
      .min(10)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 2000 characters',
        'any.required': 'Message is required'
      }),
    
    category: Joi.string()
      .valid('general', 'support', 'feedback', 'bug-report', 'feature-request')
      .default('general')
      .messages({
        'any.only': 'Please select a valid category'
      }),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .default('medium')
      .messages({
        'any.only': 'Please select a valid priority level'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validate tool query parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - Validation result
 */
const validateToolQuery = (query) => {
  const schema = Joi.object({
    category: Joi.string()
      .optional()
      .messages({
        'string.base': 'Category must be a string'
      }),
    
    featured: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Featured must be a boolean value'
      }),
    
    search: Joi.string()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Search term must be at least 1 character',
        'string.max': 'Search term cannot exceed 100 characters'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .optional()
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      }),
    
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional()
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      })
  });

  return schema.validate(query, { abortEarly: false });
};

/**
 * Check if string contains only safe characters
 * @param {string} input - Input to check
 * @returns {boolean} - True if safe
 */
const isSafeString = (input) => {
  const unsafeChars = /<script|javascript:|data:|vbscript:|onload|onerror/i;
  return !unsafeChars.test(input);
};

/**
 * Validate and sanitize input data
 * @param {Object} data - Data to validate and sanitize
 * @returns {Object} - Cleaned data
 */
const sanitizeInput = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  sanitizeString,
  validateContactForm,
  validateToolQuery,
  isSafeString,
  sanitizeInput
};