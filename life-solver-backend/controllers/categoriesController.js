/**
 * Categories Controller
 * Handles category-related operations
 */

const logger = require('../utils/logger');

// Static categories data (as requested)
const categories = [
  {
    id: 'career',
    name: 'Career',
    icon: '💼',
    description: 'Professional growth, job search, and career development',
    color: '#667eea'
  },
  {
    id: 'relationship',
    name: 'Relationship',
    icon: '❤️',
    description: 'Love, friendship, and interpersonal connections',
    color: '#fc8181'
  },
  {
    id: 'study',
    name: 'Study',
    icon: '📚',
    description: 'Learning techniques, exam prep, and academic success',
    color: '#4facfe'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    description: 'Exercise, health, and physical wellness',
    color: '#f5576c'
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '⚡',
    description: 'Time management, focus, and getting things done',
    color: '#ed8936'
  },
  {
    id: 'mental-wellness',
    name: 'Mental Wellness',
    icon: '🧘',
    description: 'Mental health, mindfulness, and emotional well-being',
    color: '#a8edea'
  }
];

/**
 * Get all categories
 * @route GET /api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    logger.error(`Get all categories error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
};

/**
 * Get single category by ID
 * @route GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { category }
    });
  } catch (error) {
    logger.error(`Get category by ID error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch category'
    });
  }
};

/**
 * Get category statistics (tools and guides count)
 * @route GET /api/categories/:id/stats
 */
const getCategoryStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }
    
    // Import data service to get counts
    const dataService = require('../services/dataService');
    
    const tools = dataService.filterByCategory('tools', id);
    const guides = dataService.filterByCategory('guides', id);
    
    const stats = {
      category: category,
      toolsCount: tools.length,
      guidesCount: guides.length,
      totalItems: tools.length + guides.length
    };
    
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    logger.error(`Get category stats error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch category statistics'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryStats
};