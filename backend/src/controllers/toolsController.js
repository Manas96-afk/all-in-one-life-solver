/**
 * Tools Controller
 * Handles HTTP requests related to AI tools
 */

const toolsService = require('../services/toolsService');
const { sendSuccess, sendError, sendNotFound, asyncHandler } = require('../utils/responseHelper');
const { validateToolQuery } = require('../utils/validator');
const logger = require('../utils/logger');

class ToolsController {
  /**
   * Get all tools with optional filtering
   * GET /api/tools
   */
  getAllTools = asyncHandler(async (req, res) => {
    try {
      // Validate query parameters
      const { error, value } = validateToolQuery(req.query);
      
      if (error) {
        const validationErrors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));
        
        return sendError(res, 'Invalid query parameters', 400, { validationErrors });
      }
      
      // Get tools from service
      const result = await toolsService.getAllTools(value);
      
      // Send successful response
      return sendSuccess(res, result, 'Tools retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getAllTools controller:', error);
      return sendError(res, 'Failed to retrieve tools', 500, error);
    }
  });
  
  /**
   * Get a single tool by ID
   * GET /api/tools/:id
   */
  getToolById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return sendError(res, 'Tool ID is required', 400);
      }
      
      // Get tool from service
      const tool = await toolsService.getToolById(id);
      
      if (!tool) {
        return sendNotFound(res, 'Tool');
      }
      
      // Send successful response
      return sendSuccess(res, tool, 'Tool retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getToolById controller:', error);
      return sendError(res, 'Failed to retrieve tool', 500, error);
    }
  });
  
  /**
   * Get featured tools
   * GET /api/tools/featured
   */
  getFeaturedTools = asyncHandler(async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      
      if (limit < 1 || limit > 20) {
        return sendError(res, 'Limit must be between 1 and 20', 400);
      }
      
      // Get featured tools from service
      const tools = await toolsService.getFeaturedTools(limit);
      
      // Send successful response
      return sendSuccess(res, { tools, count: tools.length }, 'Featured tools retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getFeaturedTools controller:', error);
      return sendError(res, 'Failed to retrieve featured tools', 500, error);
    }
  });
  
  /**
   * Get tools by category
   * GET /api/tools/category/:category
   */
  getToolsByCategory = asyncHandler(async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      
      if (!category) {
        return sendError(res, 'Category is required', 400);
      }
      
      if (limit < 1 || limit > 50) {
        return sendError(res, 'Limit must be between 1 and 50', 400);
      }
      
      // Get tools by category from service
      const tools = await toolsService.getToolsByCategory(category, limit);
      
      // Send successful response
      return sendSuccess(res, { 
        tools, 
        category, 
        count: tools.length 
      }, `Tools for category '${category}' retrieved successfully`);
      
    } catch (error) {
      logger.error('Error in getToolsByCategory controller:', error);
      return sendError(res, 'Failed to retrieve tools by category', 500, error);
    }
  });
  
  /**
   * Search tools
   * GET /api/tools/search?q=query
   */
  searchTools = asyncHandler(async (req, res) => {
    try {
      const { q: query } = req.query;
      const limit = parseInt(req.query.limit) || 10;
      
      if (!query || query.trim().length === 0) {
        return sendError(res, 'Search query is required', 400);
      }
      
      if (query.length > 100) {
        return sendError(res, 'Search query too long (max 100 characters)', 400);
      }
      
      if (limit < 1 || limit > 50) {
        return sendError(res, 'Limit must be between 1 and 50', 400);
      }
      
      // Search tools using service
      const tools = await toolsService.searchTools(query.trim(), limit);
      
      // Send successful response
      return sendSuccess(res, { 
        tools, 
        query: query.trim(), 
        count: tools.length 
      }, `Search results for '${query.trim()}' retrieved successfully`);
      
    } catch (error) {
      logger.error('Error in searchTools controller:', error);
      return sendError(res, 'Failed to search tools', 500, error);
    }
  });
  
  /**
   * Get tool statistics
   * GET /api/tools/stats
   */
  getToolStats = asyncHandler(async (req, res) => {
    try {
      // Get statistics from service
      const stats = await toolsService.getToolStats();
      
      // Send successful response
      return sendSuccess(res, stats, 'Tool statistics retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getToolStats controller:', error);
      return sendError(res, 'Failed to retrieve tool statistics', 500, error);
    }
  });
}

module.exports = new ToolsController();