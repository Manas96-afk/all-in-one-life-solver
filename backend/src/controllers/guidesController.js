/**
 * Guides Controller
 * Handles HTTP requests related to guides and tutorials
 */

const guidesService = require('../services/guidesService');
const { sendSuccess, sendError, sendNotFound, asyncHandler } = require('../utils/responseHelper');
const { validateToolQuery } = require('../utils/validator'); // Reusing for similar validation
const logger = require('../utils/logger');

class GuidesController {
  /**
   * Get all guides with optional filtering
   * GET /api/guides
   */
  getAllGuides = asyncHandler(async (req, res) => {
    try {
      // Validate query parameters (reusing tool query validation)
      const { error, value } = validateToolQuery(req.query);
      
      if (error) {
        const validationErrors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));
        
        return sendError(res, 'Invalid query parameters', 400, { validationErrors });
      }
      
      // Get guides from service
      const result = await guidesService.getAllGuides(value);
      
      // Send successful response
      return sendSuccess(res, result, 'Guides retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getAllGuides controller:', error);
      return sendError(res, 'Failed to retrieve guides', 500, error);
    }
  });
  
  /**
   * Get a single guide by ID
   * GET /api/guides/:id
   */
  getGuideById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return sendError(res, 'Guide ID is required', 400);
      }
      
      // Get guide from service
      const guide = await guidesService.getGuideById(id);
      
      if (!guide) {
        return sendNotFound(res, 'Guide');
      }
      
      // Send successful response
      return sendSuccess(res, guide, 'Guide retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getGuideById controller:', error);
      return sendError(res, 'Failed to retrieve guide', 500, error);
    }
  });
  
  /**
   * Get featured guides
   * GET /api/guides/featured
   */
  getFeaturedGuides = asyncHandler(async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 3;
      
      if (limit < 1 || limit > 10) {
        return sendError(res, 'Limit must be between 1 and 10', 400);
      }
      
      // Get featured guides from service
      const guides = await guidesService.getFeaturedGuides(limit);
      
      // Send successful response
      return sendSuccess(res, { 
        guides, 
        count: guides.length 
      }, 'Featured guides retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getFeaturedGuides controller:', error);
      return sendError(res, 'Failed to retrieve featured guides', 500, error);
    }
  });
  
  /**
   * Get guides by category
   * GET /api/guides/category/:category
   */
  getGuidesByCategory = asyncHandler(async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit) || 5;
      
      if (!category) {
        return sendError(res, 'Category is required', 400);
      }
      
      if (limit < 1 || limit > 20) {
        return sendError(res, 'Limit must be between 1 and 20', 400);
      }
      
      // Get guides by category from service
      const guides = await guidesService.getGuidesByCategory(category, limit);
      
      // Send successful response
      return sendSuccess(res, { 
        guides, 
        category, 
        count: guides.length 
      }, `Guides for category '${category}' retrieved successfully`);
      
    } catch (error) {
      logger.error('Error in getGuidesByCategory controller:', error);
      return sendError(res, 'Failed to retrieve guides by category', 500, error);
    }
  });
  
  /**
   * Search guides
   * GET /api/guides/search?q=query
   */
  searchGuides = asyncHandler(async (req, res) => {
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
      
      // Search guides using service
      const guides = await guidesService.searchGuides(query.trim(), limit);
      
      // Send successful response
      return sendSuccess(res, { 
        guides, 
        query: query.trim(), 
        count: guides.length 
      }, `Search results for '${query.trim()}' retrieved successfully`);
      
    } catch (error) {
      logger.error('Error in searchGuides controller:', error);
      return sendError(res, 'Failed to search guides', 500, error);
    }
  });
  
  /**
   * Get recent guides
   * GET /api/guides/recent
   */
  getRecentGuides = asyncHandler(async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      if (limit < 1 || limit > 20) {
        return sendError(res, 'Limit must be between 1 and 20', 400);
      }
      
      // Get recent guides from service
      const guides = await guidesService.getRecentGuides(limit);
      
      // Send successful response
      return sendSuccess(res, { 
        guides, 
        count: guides.length 
      }, 'Recent guides retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getRecentGuides controller:', error);
      return sendError(res, 'Failed to retrieve recent guides', 500, error);
    }
  });
  
  /**
   * Get guide statistics
   * GET /api/guides/stats
   */
  getGuideStats = asyncHandler(async (req, res) => {
    try {
      // Get statistics from service
      const stats = await guidesService.getGuideStats();
      
      // Send successful response
      return sendSuccess(res, stats, 'Guide statistics retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getGuideStats controller:', error);
      return sendError(res, 'Failed to retrieve guide statistics', 500, error);
    }
  });
}

module.exports = new GuidesController();