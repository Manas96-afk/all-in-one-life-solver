/**
 * Guides Controller
 * Handles all guide-related operations (CRUD)
 */

const dataService = require('../services/dataService');
const logger = require('../utils/logger');

/**
 * Get all guides
 * @route GET /api/guides
 */
const getAllGuides = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, featured, difficulty } = req.query;
    
    let guides = dataService.getAll('guides');
    
    // Filter by category
    if (category && category !== 'all') {
      guides = dataService.filterByCategory('guides', category);
    }
    
    // Filter by search query
    if (search) {
      guides = dataService.search('guides', search);
    }
    
    // Filter by featured
    if (featured === 'true') {
      guides = guides.filter(guide => guide.featured === true);
    }
    
    // Filter by difficulty
    if (difficulty) {
      guides = guides.filter(guide => guide.difficulty === difficulty);
    }
    
    // Paginate results
    const result = dataService.paginate(guides, parseInt(page), parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      data: {
        guides: result.items,
        pagination: result.pagination
      }
    });
  } catch (error) {
    logger.error(`Get all guides error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guides'
    });
  }
};

/**
 * Get single guide by ID
 * @route GET /api/guides/:id
 */
const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const guide = dataService.getById('guides', id);
    
    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { guide }
    });
  } catch (error) {
    logger.error(`Get guide by ID error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guide'
    });
  }
};

/**
 * Create new guide
 * @route POST /api/guides
 */
const createGuide = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      readTime = '5 min',
      difficulty = 'beginner',
      image = '📖',
      featured = false,
      content,
      tags = []
    } = req.body;
    
    // Validation
    if (!title || !description || !category || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, category, and content are required'
      });
    }
    
    const guideData = {
      title,
      description,
      category,
      readTime,
      difficulty,
      image,
      featured,
      content,
      tags
    };
    
    const newGuide = dataService.create('guides', guideData);
    
    if (!newGuide) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create guide'
      });
    }
    
    logger.info(`New guide created: ${newGuide.title}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Guide created successfully',
      data: { guide: newGuide }
    });
  } catch (error) {
    logger.error(`Create guide error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create guide'
    });
  }
};

/**
 * Update guide by ID
 * @route PUT /api/guides/:id
 */
const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if guide exists
    const existingGuide = dataService.getById('guides', id);
    if (!existingGuide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }
    
    const updatedGuide = dataService.update('guides', id, updateData);
    
    if (!updatedGuide) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update guide'
      });
    }
    
    logger.info(`Guide updated: ${updatedGuide.title}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Guide updated successfully',
      data: { guide: updatedGuide }
    });
  } catch (error) {
    logger.error(`Update guide error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update guide'
    });
  }
};

/**
 * Delete guide by ID
 * @route DELETE /api/guides/:id
 */
const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if guide exists
    const existingGuide = dataService.getById('guides', id);
    if (!existingGuide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }
    
    const deleted = dataService.delete('guides', id);
    
    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete guide'
      });
    }
    
    logger.info(`Guide deleted: ${existingGuide.title}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Guide deleted successfully'
    });
  } catch (error) {
    logger.error(`Delete guide error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete guide'
    });
  }
};

/**
 * Get featured guides
 * @route GET /api/guides/featured
 */
const getFeaturedGuides = async (req, res) => {
  try {
    const guides = dataService.getAll('guides');
    const featuredGuides = guides.filter(guide => guide.featured === true);
    
    res.status(200).json({
      status: 'success',
      data: { guides: featuredGuides }
    });
  } catch (error) {
    logger.error(`Get featured guides error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured guides'
    });
  }
};

module.exports = {
  getAllGuides,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide,
  getFeaturedGuides
};