/**
 * Guides Routes
 * Defines all routes related to guides and tutorials
 */

const express = require('express');
const guidesController = require('../controllers/guidesController');

const router = express.Router();

/**
 * @route   GET /api/guides
 * @desc    Get all guides with optional filtering
 * @access  Public
 * @params  ?category=string&featured=boolean&search=string&page=number&limit=number
 */
router.get('/', guidesController.getAllGuides);

/**
 * @route   GET /api/guides/featured
 * @desc    Get featured guides
 * @access  Public
 * @params  ?limit=number (default: 3, max: 10)
 */
router.get('/featured', guidesController.getFeaturedGuides);

/**
 * @route   GET /api/guides/recent
 * @desc    Get recent guides
 * @access  Public
 * @params  ?limit=number (default: 5, max: 20)
 */
router.get('/recent', guidesController.getRecentGuides);

/**
 * @route   GET /api/guides/stats
 * @desc    Get guide statistics
 * @access  Public
 */
router.get('/stats', guidesController.getGuideStats);

/**
 * @route   GET /api/guides/search
 * @desc    Search guides by query
 * @access  Public
 * @params  ?q=string&limit=number (default: 10, max: 50)
 */
router.get('/search', guidesController.searchGuides);

/**
 * @route   GET /api/guides/category/:category
 * @desc    Get guides by category
 * @access  Public
 * @params  ?limit=number (default: 5, max: 20)
 */
router.get('/category/:category', guidesController.getGuidesByCategory);

/**
 * @route   GET /api/guides/:id
 * @desc    Get a single guide by ID
 * @access  Public
 */
router.get('/:id', guidesController.getGuideById);

module.exports = router;