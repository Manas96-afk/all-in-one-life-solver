/**
 * Tools Routes
 * Defines all routes related to AI tools
 */

const express = require('express');
const toolsController = require('../controllers/toolsController');

const router = express.Router();

/**
 * @route   GET /api/tools
 * @desc    Get all tools with optional filtering
 * @access  Public
 * @params  ?category=string&featured=boolean&search=string&page=number&limit=number
 */
router.get('/', toolsController.getAllTools);

/**
 * @route   GET /api/tools/featured
 * @desc    Get featured tools
 * @access  Public
 * @params  ?limit=number (default: 6, max: 20)
 */
router.get('/featured', toolsController.getFeaturedTools);

/**
 * @route   GET /api/tools/stats
 * @desc    Get tool statistics
 * @access  Public
 */
router.get('/stats', toolsController.getToolStats);

/**
 * @route   GET /api/tools/search
 * @desc    Search tools by query
 * @access  Public
 * @params  ?q=string&limit=number (default: 10, max: 50)
 */
router.get('/search', toolsController.searchTools);

/**
 * @route   GET /api/tools/category/:category
 * @desc    Get tools by category
 * @access  Public
 * @params  ?limit=number (default: 10, max: 50)
 */
router.get('/category/:category', toolsController.getToolsByCategory);

/**
 * @route   GET /api/tools/:id
 * @desc    Get a single tool by ID
 * @access  Public
 */
router.get('/:id', toolsController.getToolById);

module.exports = router;