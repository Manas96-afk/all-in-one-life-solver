/**
 * Categories Service
 * Handles all business logic related to categories
 */

const { memoryStorage } = require('../config/database');
const logger = require('../utils/logger');

class CategoriesService {
  /**
   * Get all categories
   * @returns {Array} - Array of all categories
   */
  async getAllCategories() {
    try {
      const categories = [...memoryStorage.categories];
      
      // Add tool count for each category
      const categoriesWithCounts = categories.map(category => {
        const toolCount = category.id === 'all' 
          ? memoryStorage.tools.length
          : memoryStorage.tools.filter(tool => 
              tool.category.toLowerCase() === category.name.toLowerCase()
            ).length;
        
        return {
          ...category,
          toolCount,
          hasTools: toolCount > 0
        };
      });
      
      logger.info(`Retrieved ${categoriesWithCounts.length} categories`);
      return categoriesWithCounts;
    } catch (error) {
      logger.error('Error in getAllCategories:', error);
      throw new Error('Failed to retrieve categories');
    }
  }
  
  /**
   * Get a single category by ID
   * @param {string} categoryId - Category identifier
   * @returns {Object|null} - Category data or null if not found
   */
  async getCategoryById(categoryId) {
    try {
      const category = memoryStorage.categories.find(c => c.id === categoryId);
      
      if (!category) {
        logger.warn(`Category not found: ${categoryId}`);
        return null;
      }
      
      // Add tool count and tools for this category
      const toolCount = categoryId === 'all' 
        ? memoryStorage.tools.length
        : memoryStorage.tools.filter(tool => 
            tool.category.toLowerCase() === category.name.toLowerCase()
          ).length;
      
      const tools = categoryId === 'all'
        ? memoryStorage.tools
        : memoryStorage.tools.filter(tool => 
            tool.category.toLowerCase() === category.name.toLowerCase()
          );
      
      const categoryWithDetails = {
        ...category,
        toolCount,
        hasTools: toolCount > 0,
        tools: tools.slice(0, 10) // Limit to first 10 tools
      };
      
      logger.info(`Retrieved category: ${category.name} with ${toolCount} tools`);
      return categoryWithDetails;
    } catch (error) {
      logger.error('Error in getCategoryById:', error);
      throw new Error('Failed to retrieve category');
    }
  }
  
  /**
   * Get categories with tools
   * @returns {Array} - Array of categories that have tools
   */
  async getCategoriesWithTools() {
    try {
      const categoriesWithTools = memoryStorage.categories
        .map(category => {
          const toolCount = category.id === 'all' 
            ? memoryStorage.tools.length
            : memoryStorage.tools.filter(tool => 
                tool.category.toLowerCase() === category.name.toLowerCase()
              ).length;
          
          return {
            ...category,
            toolCount,
            hasTools: toolCount > 0
          };
        })
        .filter(category => category.hasTools);
      
      logger.info(`Retrieved ${categoriesWithTools.length} categories with tools`);
      return categoriesWithTools;
    } catch (error) {
      logger.error('Error in getCategoriesWithTools:', error);
      throw new Error('Failed to retrieve categories with tools');
    }
  }
  
  /**
   * Get popular categories (categories with most tools)
   * @param {number} limit - Number of categories to return
   * @returns {Array} - Array of popular categories
   */
  async getPopularCategories(limit = 5) {
    try {
      const categoriesWithCounts = memoryStorage.categories
        .filter(category => category.id !== 'all') // Exclude 'all' category
        .map(category => {
          const toolCount = memoryStorage.tools.filter(tool => 
            tool.category.toLowerCase() === category.name.toLowerCase()
          ).length;
          
          return {
            ...category,
            toolCount,
            hasTools: toolCount > 0
          };
        })
        .filter(category => category.hasTools)
        .sort((a, b) => b.toolCount - a.toolCount)
        .slice(0, limit);
      
      logger.info(`Retrieved ${categoriesWithCounts.length} popular categories`);
      return categoriesWithCounts;
    } catch (error) {
      logger.error('Error in getPopularCategories:', error);
      throw new Error('Failed to retrieve popular categories');
    }
  }
  
  /**
   * Search categories by name or description
   * @param {string} query - Search query
   * @returns {Array} - Array of matching categories
   */
  async searchCategories(query) {
    try {
      const searchTerm = query.toLowerCase();
      const matchingCategories = memoryStorage.categories
        .filter(category =>
          category.name.toLowerCase().includes(searchTerm) ||
          (category.description && category.description.toLowerCase().includes(searchTerm))
        )
        .map(category => {
          const toolCount = category.id === 'all' 
            ? memoryStorage.tools.length
            : memoryStorage.tools.filter(tool => 
                tool.category.toLowerCase() === category.name.toLowerCase()
              ).length;
          
          return {
            ...category,
            toolCount,
            hasTools: toolCount > 0
          };
        });
      
      logger.info(`Search for "${query}" returned ${matchingCategories.length} category results`);
      return matchingCategories;
    } catch (error) {
      logger.error('Error in searchCategories:', error);
      throw new Error('Failed to search categories');
    }
  }
  
  /**
   * Get category statistics
   * @returns {Object} - Category statistics
   */
  async getCategoryStats() {
    try {
      const stats = {
        totalCategories: memoryStorage.categories.length,
        categoriesWithTools: memoryStorage.categories.filter(category => {
          const toolCount = category.id === 'all' 
            ? memoryStorage.tools.length
            : memoryStorage.tools.filter(tool => 
                tool.category.toLowerCase() === category.name.toLowerCase()
              ).length;
          return toolCount > 0;
        }).length,
        mostPopularCategory: this._getMostPopularCategory(),
        averageToolsPerCategory: this._getAverageToolsPerCategory(),
        categoryDistribution: this._getCategoryDistribution()
      };
      
      logger.info('Generated category statistics');
      return stats;
    } catch (error) {
      logger.error('Error in getCategoryStats:', error);
      throw new Error('Failed to generate category statistics');
    }
  }
  
  /**
   * Get most popular category (private method)
   * @returns {Object} - Most popular category
   */
  _getMostPopularCategory() {
    const categoryWithMostTools = memoryStorage.categories
      .filter(category => category.id !== 'all')
      .map(category => {
        const toolCount = memoryStorage.tools.filter(tool => 
          tool.category.toLowerCase() === category.name.toLowerCase()
        ).length;
        return { ...category, toolCount };
      })
      .sort((a, b) => b.toolCount - a.toolCount)[0];
    
    return categoryWithMostTools || null;
  }
  
  /**
   * Get average tools per category (private method)
   * @returns {number} - Average number of tools per category
   */
  _getAverageToolsPerCategory() {
    const categoriesWithTools = memoryStorage.categories.filter(cat => cat.id !== 'all');
    if (categoriesWithTools.length === 0) return 0;
    
    const totalTools = memoryStorage.tools.length;
    return Math.round(totalTools / categoriesWithTools.length);
  }
  
  /**
   * Get category distribution (private method)
   * @returns {Array} - Array of categories with their tool counts
   */
  _getCategoryDistribution() {
    return memoryStorage.categories
      .filter(category => category.id !== 'all')
      .map(category => {
        const toolCount = memoryStorage.tools.filter(tool => 
          tool.category.toLowerCase() === category.name.toLowerCase()
        ).length;
        
        return {
          name: category.name,
          count: toolCount,
          percentage: memoryStorage.tools.length > 0 
            ? Math.round((toolCount / memoryStorage.tools.length) * 100)
            : 0
        };
      })
      .sort((a, b) => b.count - a.count);
  }
}

module.exports = new CategoriesService();