/**
 * Contact Routes
 * Defines all routes related to contact form submissions
 */

const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 * @body    { name, email, phone?, subject, message, category?, priority? }
 */
router.post('/', contactController.submitContactForm);

/**
 * @route   GET /api/contact/health
 * @desc    Health check for contact system
 * @access  Public
 */
router.get('/health', contactController.healthCheck);

// Admin routes (in a real application, these would require authentication)
/**
 * @route   GET /api/contact/admin/all
 * @desc    Get all contact submissions (admin only)
 * @access  Admin
 * @params  ?status=string&category=string&startDate=date&endDate=date&page=number&limit=number
 */
router.get('/admin/all', contactController.getAllContacts);

/**
 * @route   GET /api/contact/admin/stats
 * @desc    Get contact statistics (admin only)
 * @access  Admin
 */
router.get('/admin/stats', contactController.getContactStats);

/**
 * @route   GET /api/contact/admin/:id
 * @desc    Get contact submission by ID (admin only)
 * @access  Admin
 */
router.get('/admin/:id', contactController.getContactById);

/**
 * @route   PUT /api/contact/admin/:id/status
 * @desc    Update contact status (admin only)
 * @access  Admin
 * @body    { status, response? }
 */
router.put('/admin/:id/status', contactController.updateContactStatus);

module.exports = router;