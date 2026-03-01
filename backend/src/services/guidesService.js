/**
 * Guides Service
 * Handles all business logic related to guides and tutorials
 */

const { memoryStorage } = require('../config/database');
const logger = require('../utils/logger');

class GuidesService {
  /**
   * Get all guides with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Object} - Guides data with pagination
   */
  async getAllGuides(filters = {}) {
    try {
      let guides = [...memoryStorage.guides];
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        guides = guides.filter(guide => 
          guide.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // Apply featured filter
      if (filters.featured !== undefined) {
        guides = guides.filter(guide => guide.featured === filters.featured);
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        guides = guides.filter(guide =>
          guide.title.toLowerCase().includes(searchTerm) ||
          guide.description.toLowerCase().includes(searchTerm) ||
          guide.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          guide.author.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by creation date (newest first)
      guides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Calculate pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedGuides = guides.slice(startIndex, endIndex);
      
      const result = {
        guides: paginatedGuides,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(guides.length / limit),
          totalItems: guides.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < guides.length,
          hasPrevPage: page > 1
        }
      };
      
      logger.info(`Retrieved ${paginatedGuides.length} guides`, {
        filters,
        totalFound: guides.length
      });
      
      return result;
    } catch (error) {
      logger.error('Error in getAllGuides:', error);
      throw new Error('Failed to retrieve guides');
    }
  }
  
  /**
   * Get a single guide by ID
   * @param {string} guideId - Guide identifier
   * @returns {Object|null} - Guide data or null if not found
   */
  async getGuideById(guideId) {
    try {
      const guide = memoryStorage.guides.find(g => g.id === guideId);
      
      if (!guide) {
        logger.warn(`Guide not found: ${guideId}`);
        return null;
      }
      
      logger.info(`Retrieved guide: ${guide.title}`);
      return guide;
    } catch (error) {
      logger.error('Error in getGuideById:', error);
      throw new Error('Failed to retrieve guide');
    }
  }
  
  /**
   * Get featured guides
   * @param {number} limit - Number of guides to return
   * @returns {Array} - Array of featured guides
   */
  async getFeaturedGuides(limit = 3) {
    try {
      const featuredGuides = memoryStorage.guides
        .filter(guide => guide.featured)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      logger.info(`Retrieved ${featuredGuides.length} featured guides`);
      return featuredGuides;
    } catch (error) {
      logger.error('Error in getFeaturedGuides:', error);
      throw new Error('Failed to retrieve featured guides');
    }
  }
  
  /**
   * Get guides by category
   * @param {string} category - Category name
   * @param {number} limit - Number of guides to return
   * @returns {Array} - Array of guides in category
   */
  async getGuidesByCategory(category, limit = 5) {
    try {
      const categoryGuides = memoryStorage.guides
        .filter(guide => guide.category.toLowerCase() === category.toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      logger.info(`Retrieved ${categoryGuides.length} guides for category: ${category}`);
      return categoryGuides;
    } catch (error) {
      logger.error('Error in getGuidesByCategory:', error);
      throw new Error('Failed to retrieve guides by category');
    }
  }
  
  /**
   * Search guides by query
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Array} - Array of matching guides
   */
  async searchGuides(query, limit = 10) {
    try {
      const searchTerm = query.toLowerCase();
      const matchingGuides = memoryStorage.guides
        .filter(guide =>
          guide.title.toLowerCase().includes(searchTerm) ||
          guide.description.toLowerCase().includes(searchTerm) ||
          guide.content.toLowerCase().includes(searchTerm) ||
          guide.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          guide.author.toLowerCase().includes(searchTerm)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      logger.info(`Search for "${query}" returned ${matchingGuides.length} guide results`);
      return matchingGuides;
    } catch (error) {
      logger.error('Error in searchGuides:', error);
      throw new Error('Failed to search guides');
    }
  }
  
  /**
   * Get recent guides
   * @param {number} limit - Number of guides to return
   * @returns {Array} - Array of recent guides
   */
  async getRecentGuides(limit = 5) {
    try {
      const recentGuides = memoryStorage.guides
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      logger.info(`Retrieved ${recentGuides.length} recent guides`);
      return recentGuides;
    } catch (error) {
      logger.error('Error in getRecentGuides:', error);
      throw new Error('Failed to retrieve recent guides');
    }
  }
  
  /**
   * Get guide statistics
   * @returns {Object} - Guide statistics
   */
  async getGuideStats() {
    try {
      const stats = {
        totalGuides: memoryStorage.guides.length,
        featuredGuides: memoryStorage.guides.filter(g => g.featured).length,
        categoriesWithGuides: [...new Set(memoryStorage.guides.map(g => g.category))].length,
        averageReadTime: this._calculateAverageReadTime(),
        mostActiveAuthor: this._getMostActiveAuthor(),
        recentlyPublished: memoryStorage.guides
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
      };
      
      logger.info('Generated guide statistics');
      return stats;
    } catch (error) {
      logger.error('Error in getGuideStats:', error);
      throw new Error('Failed to generate guide statistics');
    }
  }
  
  /**
   * Calculate average read time (private method)
   * @returns {string} - Average read time
   */
  _calculateAverageReadTime() {
    if (memoryStorage.guides.length === 0) return '0 min';
    
    const totalMinutes = memoryStorage.guides.reduce((sum, guide) => {
      const minutes = parseInt(guide.readTime.replace(/\D/g, '')) || 0;
      return sum + minutes;
    }, 0);
    
    const average = Math.round(totalMinutes / memoryStorage.guides.length);
    return `${average} min`;
  }
  
  /**
   * Get most active author (private method)
   * @returns {string} - Most active author name
   */
  _getMostActiveAuthor() {
    if (memoryStorage.guides.length === 0) return 'N/A';
    
    const authorCount = {};
    memoryStorage.guides.forEach(guide => {
      authorCount[guide.author] = (authorCount[guide.author] || 0) + 1;
    });
    
    return Object.keys(authorCount).reduce((a, b) => 
      authorCount[a] > authorCount[b] ? a : b
    );
  }
}

module.exports = new GuidesService();