/**
 * Tools Controller
 * Handles all tool-related operations (CRUD)
 */

const dataService = require('../services/dataService');
const logger = require('../utils/logger');

/**
 * Get all tools
 * @route GET /api/tools
 */
const getAllTools = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, featured } = req.query;
    
    let tools = dataService.getAll('tools');
    
    // Filter by category
    if (category && category !== 'all') {
      tools = dataService.filterByCategory('tools', category);
    }
    
    // Filter by search query
    if (search) {
      tools = dataService.search('tools', search);
    }
    
    // Filter by featured
    if (featured === 'true') {
      tools = tools.filter(tool => tool.featured === true);
    }
    
    // Paginate results
    const result = dataService.paginate(tools, parseInt(page), parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      data: {
        tools: result.items,
        pagination: result.pagination
      }
    });
  } catch (error) {
    logger.error(`Get all tools error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tools'
    });
  }
};

/**
 * Get single tool by ID
 * @route GET /api/tools/:id
 */
const getToolById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tool = dataService.getById('tools', id);
    
    if (!tool) {
      return res.status(404).json({
        status: 'error',
        message: 'Tool not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { tool }
    });
  } catch (error) {
    logger.error(`Get tool by ID error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tool'
    });
  }
};

/**
 * Create new tool
 * @route POST /api/tools
 */
const createTool = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      icon,
      featured = false,
      tags = [],
      difficulty = 'easy',
      estimatedTime = '2-5 minutes'
    } = req.body;
    
    // Validation
    if (!name || !description || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, description, and category are required'
      });
    }
    
    const toolData = {
      name,
      description,
      category,
      icon: icon || '🔧',
      featured,
      tags,
      difficulty,
      estimatedTime
    };
    
    const newTool = dataService.create('tools', toolData);
    
    if (!newTool) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create tool'
      });
    }
    
    logger.info(`New tool created: ${newTool.name}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Tool created successfully',
      data: { tool: newTool }
    });
  } catch (error) {
    logger.error(`Create tool error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create tool'
    });
  }
};

/**
 * Update tool by ID
 * @route PUT /api/tools/:id
 */
const updateTool = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if tool exists
    const existingTool = dataService.getById('tools', id);
    if (!existingTool) {
      return res.status(404).json({
        status: 'error',
        message: 'Tool not found'
      });
    }
    
    const updatedTool = dataService.update('tools', id, updateData);
    
    if (!updatedTool) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update tool'
      });
    }
    
    logger.info(`Tool updated: ${updatedTool.name}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Tool updated successfully',
      data: { tool: updatedTool }
    });
  } catch (error) {
    logger.error(`Update tool error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update tool'
    });
  }
};

/**
 * Delete tool by ID
 * @route DELETE /api/tools/:id
 */
const deleteTool = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if tool exists
    const existingTool = dataService.getById('tools', id);
    if (!existingTool) {
      return res.status(404).json({
        status: 'error',
        message: 'Tool not found'
      });
    }
    
    const deleted = dataService.delete('tools', id);
    
    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete tool'
      });
    }
    
    logger.info(`Tool deleted: ${existingTool.name}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    logger.error(`Delete tool error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete tool'
    });
  }
};

/**
 * Get featured tools
 * @route GET /api/tools/featured
 */
const getFeaturedTools = async (req, res) => {
  try {
    const tools = dataService.getAll('tools');
    const featuredTools = tools.filter(tool => tool.featured === true);
    
    res.status(200).json({
      status: 'success',
      data: { tools: featuredTools }
    });
  } catch (error) {
    logger.error(`Get featured tools error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured tools'
    });
  }
};

module.exports = {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  getFeaturedTools
};