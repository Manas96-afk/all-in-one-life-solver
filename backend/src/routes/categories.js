/**
 * Categories Routes
 * Defines all routes related to categories
 */

const express = require('express');
const categoriesController = require('../controllers/categoriesController');

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoriesController.getAllCategories);

/**
 * @route   GET /api/categories/with-tools
 * @desc    Get categories that have tools
 * @access  Public
 */
router.get('/with-tools', categoriesController.getCategoriesWithTools);

/**
 * @route   GET /api/categories/popular
 * @desc    Get popular categories (categories with most tools)
 * @access  Public
 * @params  ?limit=number (default: 5, max: 10)
 */
router.get('/popular', categoriesController.getPopularCategories);

/**
 * @route   GET /api/categories/stats
 * @desc    Get category statistics
 * @access  Public
 */
router.get('/stats', categoriesController.getCategoryStats);

/**
 * @route   GET /api/categories/search
 * @desc    Search categories by name or description
 * @access  Public
 * @params  ?q=string (max: 50 characters)
 */
router.get('/search', categoriesController.searchCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get a single category by ID with its tools
 * @access  Public
 */
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;