/**
 * Contact Service
 * Handles all business logic related to contact form submissions
 */

const { memoryStorage } = require('../config/database');
const logger = require('../utils/logger');
const { validateContactForm } = require('../utils/validator');

class ContactService {
  /**
   * Store contact form submission
   * @param {Object} contactData - Contact form data
   * @returns {Object} - Stored contact data
   */
  async storeContactForm(contactData) {
    try {
      // Validate the contact form data
      const { error, value } = validateContactForm(contactData);
      
      if (error) {
        const validationErrors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));
        
        logger.warn('Contact form validation failed', { validationErrors });
        throw new ValidationError('Validation failed', validationErrors);
      }
      
      // Create contact entry
      const contact = {
        id: this._generateId(),
        ...value,
        status: 'new',
        submittedAt: new Date(),
        processed: false,
        processedAt: null,
        response: null
      };
      
      // Store in memory
      memoryStorage.contacts.push(contact);
      
      logger.info(`Contact form submitted successfully`, {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        category: contact.category
      });
      
      // Return contact data
      return contact;
      
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      
      logger.error('Error storing contact form:', error);
      throw new Error('Failed to store contact form');
    }
  }
  
  /**
   * Get all contact submissions (admin function)
   * @param {Object} filters - Filter options
   * @returns {Object} - Contact submissions with pagination
   */
  async getAllContacts(filters = {}) {
    try {
      let contacts = [...memoryStorage.contacts];
      
      // Apply status filter
      if (filters.status) {
        contacts = contacts.filter(contact => contact.status === filters.status);
      }
      
      // Apply category filter
      if (filters.category) {
        contacts = contacts.filter(contact => contact.category === filters.category);
      }
      
      // Apply date range filter
      if (filters.startDate || filters.endDate) {
        contacts = contacts.filter(contact => {
          const submittedDate = new Date(contact.submittedAt);
          const start = filters.startDate ? new Date(filters.startDate) : new Date('1970-01-01');
          const end = filters.endDate ? new Date(filters.endDate) : new Date();
          
          return submittedDate >= start && submittedDate <= end;
        });
      }
      
      // Sort by submission date (newest first)
      contacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      
      // Calculate pagination
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedContacts = contacts.slice(startIndex, endIndex);
      
      const result = {
        contacts: paginatedContacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(contacts.length / limit),
          totalItems: contacts.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < contacts.length,
          hasPrevPage: page > 1
        }
      };
      
      logger.info(`Retrieved ${paginatedContacts.length} contact submissions`);
      return result;
      
    } catch (error) {
      logger.error('Error retrieving contacts:', error);
      throw new Error('Failed to retrieve contact submissions');
    }
  }
  
  /**
   * Get contact by ID
   * @param {string} contactId - Contact identifier
   * @returns {Object|null} - Contact data or null if not found
   */
  async getContactById(contactId) {
    try {
      const contact = memoryStorage.contacts.find(c => c.id === contactId);
      
      if (!contact) {
        logger.warn(`Contact not found: ${contactId}`);
        return null;
      }
      
      logger.info(`Retrieved contact: ${contact.id}`);
      return contact;
      
    } catch (error) {
      logger.error('Error retrieving contact by ID:', error);
      throw new Error('Failed to retrieve contact');
    }
  }
  
  /**
   * Update contact status
   * @param {string} contactId - Contact identifier
   * @param {string} status - New status
   * @param {string} response - Optional response message
   * @returns {Object|null} - Updated contact or null if not found
   */
  async updateContactStatus(contactId, status, response = null) {
    try {
      const contactIndex = memoryStorage.contacts.findIndex(c => c.id === contactId);
      
      if (contactIndex === -1) {
        logger.warn(`Contact not found for update: ${contactId}`);
        return null;
      }
      
      // Update contact
      memoryStorage.contacts[contactIndex] = {
        ...memoryStorage.contacts[contactIndex],
        status,
        response,
        processed: status !== 'new',
        processedAt: status !== 'new' ? new Date() : null
      };
      
      const updatedContact = memoryStorage.contacts[contactIndex];
      
      logger.info(`Contact status updated`, {
        id: contactId,
        status,
        hasResponse: !!response
      });
      
      return updatedContact;
      
    } catch (error) {
      logger.error('Error updating contact status:', error);
      throw new Error('Failed to update contact status');
    }
  }
  
  /**
   * Get contact statistics
   * @returns {Object} - Contact statistics
   */
  async getContactStats() {
    try {
      const stats = {
        totalSubmissions: memoryStorage.contacts.length,
        newSubmissions: memoryStorage.contacts.filter(c => c.status === 'new').length,
        processedSubmissions: memoryStorage.contacts.filter(c => c.processed).length,
        submissionsByCategory: this._getSubmissionsByCategory(),
        recentSubmissions: memoryStorage.contacts
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 5),
        submissionsToday: this._getSubmissionsToday(),
        averageResponseTime: this._getAverageResponseTime()
      };
      
      logger.info('Generated contact statistics');
      return stats;
      
    } catch (error) {
      logger.error('Error generating contact stats:', error);
      throw new Error('Failed to generate contact statistics');
    }
  }
  
  /**
   * Generate unique ID (private method)
   * @returns {string} - Unique identifier
   */
  _generateId() {
    return 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Get submissions by category (private method)
   * @returns {Object} - Category breakdown
   */
  _getSubmissionsByCategory() {
    const categoryCount = {};
    memoryStorage.contacts.forEach(contact => {
      categoryCount[contact.category] = (categoryCount[contact.category] || 0) + 1;
    });
    return categoryCount;
  }
  
  /**
   * Get submissions today (private method)
   * @returns {number} - Number of submissions today
   */
  _getSubmissionsToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return memoryStorage.contacts.filter(contact => {
      const submittedDate = new Date(contact.submittedAt);
      return submittedDate >= today;
    }).length;
  }
  
  /**
   * Get average response time (private method)
   * @returns {string} - Average response time
   */
  _getAverageResponseTime() {
    const processedContacts = memoryStorage.contacts.filter(c => c.processed && c.processedAt);
    
    if (processedContacts.length === 0) return 'N/A';
    
    const totalResponseTime = processedContacts.reduce((sum, contact) => {
      const responseTime = new Date(contact.processedAt) - new Date(contact.submittedAt);
      return sum + responseTime;
    }, 0);
    
    const averageMs = totalResponseTime / processedContacts.length;
    const averageHours = Math.round(averageMs / (1000 * 60 * 60));
    
    return `${averageHours} hours`;
  }
}

// Custom validation error class
class ValidationError extends Error {
  constructor(message, validationErrors) {
    super(message);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

module.exports = new ContactService();
module.exports.ValidationError = ValidationError;