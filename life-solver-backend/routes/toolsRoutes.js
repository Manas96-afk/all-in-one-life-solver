/**
 * Tools Routes
 * Defines all routes for tool operations
 */

const express = require('express');
const {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  getFeaturedTools
} = require('../controllers/toolsController');
const { protect, optionalAuth } = require('../utils/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllTools);
router.get('/featured', getFeaturedTools);
router.get('/:id', getToolById);

// Protected routes (require authentication)
router.post('/', protect, createTool);
router.put('/:id', protect, updateTool);
router.delete('/:id', protect, deleteTool);

module.exports = router;