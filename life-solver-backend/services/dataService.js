/**
 * Data Service
 * Handles data operations for tools and guides
 * Uses JSON files as database (can be easily switched to MongoDB)
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class DataService {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.ensureDataDirectory();
  }

  /**
   * Ensure data directory exists
   */
  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      logger.info('Created data directory');
    }
  }

  /**
   * Read data from JSON file
   */
  readData(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      
      if (!fs.existsSync(filePath)) {
        // Create empty file if it doesn't exist
        this.writeData(filename, []);
        return [];
      }
      
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Error reading ${filename}: ${error.message}`);
      return [];
    }
  }

  /**
   * Write data to JSON file
   */
  writeData(filename, data) {
    try {
      const filePath = path.join(this.dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      logger.error(`Error writing ${filename}: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get all items from a collection
   */
  getAll(collection) {
    return this.readData(`${collection}.json`);
  }

  /**
   * Get item by ID
   */
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id);
  }

  /**
   * Create new item
   */
  create(collection, data) {
    const items = this.getAll(collection);
    const newItem = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    
    if (this.writeData(`${collection}.json`, items)) {
      return newItem;
    }
    
    return null;
  }

  /**
   * Update item by ID
   */
  update(collection, id, data) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    if (this.writeData(`${collection}.json`, items)) {
      return items[index];
    }
    
    return null;
  }

  /**
   * Delete item by ID
   */
  delete(collection, id) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    items.splice(index, 1);
    return this.writeData(`${collection}.json`, items);
  }

  /**
   * Search items by query
   */
  search(collection, query) {
    const items = this.getAll(collection);
    
    if (!query) {
      return items;
    }
    
    const searchTerm = query.toLowerCase();
    
    return items.filter(item => {
      return (
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.title && item.title.toLowerCase().includes(searchTerm)) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.category && item.category.toLowerCase().includes(searchTerm)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    });
  }

  /**
   * Filter items by category
   */
  filterByCategory(collection, category) {
    const items = this.getAll(collection);
    
    if (!category || category === 'all') {
      return items;
    }
    
    return items.filter(item => 
      item.category && item.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get items with pagination
   */
  paginate(items, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(items.length / limit),
        totalItems: items.length,
        hasNextPage: endIndex < items.length,
        hasPrevPage: startIndex > 0
      }
    };
  }
}

module.exports = new DataService();