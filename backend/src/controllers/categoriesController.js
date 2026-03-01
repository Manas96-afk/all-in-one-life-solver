/**
 * Categories Controller
 * Handles HTTP requests related to categories
 */

const categoriesService = require('../services/categoriesService');
const { sendSuccess, sendError, sendNotFound, asyncHandler } = require('../utils/responseHelper');
const logger = require('../utils/logger');

class CategoriesController {
  /**
   * Get all categories
   * GET /api/categories
   */
  getAllCategories = asyncHandler(async (req, res) => {
    try {
      // Get categories from service
      const categories = await categoriesService.getAllCategories();
      
      // Send successful response
      return sendSuccess(res, { 
        categories, 
        count: categories.length 
      }, 'Categories retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getAllCategories controller:', error);
      return sendError(res, 'Failed to retrieve categories', 500, error);
    }
  });
  
  /**
   * Get a single category by ID
   * GET /api/categories/:id
   */
  getCategoryById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return sendError(res, 'Category ID is required', 400);
      }
      
      // Get category from service
      const category = await categoriesService.getCategoryById(id);
      
      if (!category) {
        return sendNotFound(res, 'Category');
      }
      
      // Send successful response
      return sendSuccess(res, category, 'Category retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getCategoryById controller:', error);
      return sendError(res, 'Failed to retrieve category', 500, error);
    }
  });
  
  /**
   * Get categories with tools
   * GET /api/categories/with-tools
   */
  getCategoriesWithTools = asyncHandler(async (req, res) => {
    try {
      // Get categories with tools from service
      const categories = await categoriesService.getCategoriesWithTools();
      
      // Send successful response
      return sendSuccess(res, { 
        categories, 
        count: categories.length 
      }, 'Categories with tools retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getCategoriesWithTools controller:', error);
      return sendError(res, 'Failed to retrieve categories with tools', 500, error);
    }
  });
  
  /**
   * Get popular categories
   * GET /api/categories/popular
   */
  getPopularCategories = asyncHandler(async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      if (limit < 1 || limit > 10) {
        return sendError(res, 'Limit must be between 1 and 10', 400);
      }
      
      // Get popular categories from service
      const categories = await categoriesService.getPopularCategories(limit);
      
      // Send successful response
      return sendSuccess(res, { 
        categories, 
        count: categories.length 
      }, 'Popular categories retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getPopularCategories controller:', error);
      return sendError(res, 'Failed to retrieve popular categories', 500, error);
    }
  });
  
  /**
   * Search categories
   * GET /api/categories/search?q=query
   */
  searchCategories = asyncHandler(async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query || query.trim().length === 0) {
        return sendError(res, 'Search query is required', 400);
      }
      
      if (query.length > 50) {
        return sendError(res, 'Search query too long (max 50 characters)', 400);
      }
      
      // Search categories using service
      const categories = await categoriesService.searchCategories(query.trim());
      
      // Send successful response
      return sendSuccess(res, { 
        categories, 
        query: query.trim(), 
        count: categories.length 
      }, `Search results for '${query.trim()}' retrieved successfully`);
      
    } catch (error) {
      logger.error('Error in searchCategories controller:', error);
      return sendError(res, 'Failed to search categories', 500, error);
    }
  });
  
  /**
   * Get category statistics
   * GET /api/categories/stats
   */
  getCategoryStats = asyncHandler(async (req, res) => {
    try {
      // Get statistics from service
      const stats = await categoriesService.getCategoryStats();
      
      // Send successful response
      return sendSuccess(res, stats, 'Category statistics retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getCategoryStats controller:', error);
      return sendError(res, 'Failed to retrieve category statistics', 500, error);
    }
  });
}

module.exports = new CategoriesController();