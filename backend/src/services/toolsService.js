/**
 * Tools Service
 * Handles all business logic related to AI tools
 */

const { memoryStorage } = require('../config/database');
const logger = require('../utils/logger');

class ToolsService {
  /**
   * Get all tools with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Object} - Tools data with pagination
   */
  async getAllTools(filters = {}) {
    try {
      let tools = [...memoryStorage.tools];
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        tools = tools.filter(tool => 
          tool.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // Apply featured filter
      if (filters.featured !== undefined) {
        tools = tools.filter(tool => tool.featured === filters.featured);
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        tools = tools.filter(tool =>
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // Calculate pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedTools = tools.slice(startIndex, endIndex);
      
      const result = {
        tools: paginatedTools,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(tools.length / limit),
          totalItems: tools.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < tools.length,
          hasPrevPage: page > 1
        }
      };
      
      logger.info(`Retrieved ${paginatedTools.length} tools`, {
        filters,
        totalFound: tools.length
      });
      
      return result;
    } catch (error) {
      logger.error('Error in getAllTools:', error);
      throw new Error('Failed to retrieve tools');
    }
  }
  
  /**
   * Get a single tool by ID
   * @param {string} toolId - Tool identifier
   * @returns {Object|null} - Tool data or null if not found
   */
  async getToolById(toolId) {
    try {
      const tool = memoryStorage.tools.find(t => t.id === toolId);
      
      if (!tool) {
        logger.warn(`Tool not found: ${toolId}`);
        return null;
      }
      
      logger.info(`Retrieved tool: ${tool.name}`);
      return tool;
    } catch (error) {
      logger.error('Error in getToolById:', error);
      throw new Error('Failed to retrieve tool');
    }
  }
  
  /**
   * Get featured tools
   * @param {number} limit - Number of tools to return
   * @returns {Array} - Array of featured tools
   */
  async getFeaturedTools(limit = 6) {
    try {
      const featuredTools = memoryStorage.tools
        .filter(tool => tool.featured)
        .slice(0, limit);
      
      logger.info(`Retrieved ${featuredTools.length} featured tools`);
      return featuredTools;
    } catch (error) {
      logger.error('Error in getFeaturedTools:', error);
      throw new Error('Failed to retrieve featured tools');
    }
  }
  
  /**
   * Get tools by category
   * @param {string} category - Category name
   * @param {number} limit - Number of tools to return
   * @returns {Array} - Array of tools in category
   */
  async getToolsByCategory(category, limit = 10) {
    try {
      const categoryTools = memoryStorage.tools
        .filter(tool => tool.category.toLowerCase() === category.toLowerCase())
        .slice(0, limit);
      
      logger.info(`Retrieved ${categoryTools.length} tools for category: ${category}`);
      return categoryTools;
    } catch (error) {
      logger.error('Error in getToolsByCategory:', error);
      throw new Error('Failed to retrieve tools by category');
    }
  }
  
  /**
   * Search tools by query
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Array} - Array of matching tools
   */
  async searchTools(query, limit = 10) {
    try {
      const searchTerm = query.toLowerCase();
      const matchingTools = memoryStorage.tools
        .filter(tool =>
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          tool.category.toLowerCase().includes(searchTerm)
        )
        .slice(0, limit);
      
      logger.info(`Search for "${query}" returned ${matchingTools.length} results`);
      return matchingTools;
    } catch (error) {
      logger.error('Error in searchTools:', error);
      throw new Error('Failed to search tools');
    }
  }
  
  /**
   * Get tool statistics
   * @returns {Object} - Tool statistics
   */
  async getToolStats() {
    try {
      const stats = {
        totalTools: memoryStorage.tools.length,
        featuredTools: memoryStorage.tools.filter(t => t.featured).length,
        categoriesWithTools: [...new Set(memoryStorage.tools.map(t => t.category))].length,
        mostPopularCategory: this._getMostPopularCategory(),
        recentlyAdded: memoryStorage.tools
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
      };
      
      logger.info('Generated tool statistics');
      return stats;
    } catch (error) {
      logger.error('Error in getToolStats:', error);
      throw new Error('Failed to generate tool statistics');
    }
  }
  
  /**
   * Get most popular category (private method)
   * @returns {string} - Most popular category name
   */
  _getMostPopularCategory() {
    const categoryCount = {};
    memoryStorage.tools.forEach(tool => {
      categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
    });
    
    return Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );
  }
}

module.exports = new ToolsService();