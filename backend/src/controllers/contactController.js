/**
 * Contact Controller
 * Handles HTTP requests related to contact form submissions
 */

const contactService = require('../services/contactService');
const { ValidationError } = require('../services/contactService');
const { sendSuccess, sendError, sendNotFound, sendCreated, sendValidationError, asyncHandler } = require('../utils/responseHelper');
const { sanitizeInput } = require('../utils/validator');
const logger = require('../utils/logger');

class ContactController {
  /**
   * Submit contact form
   * POST /api/contact
   */
  submitContactForm = asyncHandler(async (req, res) => {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeInput(req.body);
      
      // Store contact form using service
      const contact = await contactService.storeContactForm(sanitizedData);
      
      // Send successful response
      return sendCreated(res, {
        id: contact.id,
        message: 'Thank you for your message! We will get back to you soon.',
        submittedAt: contact.submittedAt,
        status: contact.status
      }, 'Contact form submitted successfully');
      
    } catch (error) {
      if (error instanceof ValidationError) {
        return sendValidationError(res, error.validationErrors, error.message);
      }
      
      logger.error('Error in submitContactForm controller:', error);
      return sendError(res, 'Failed to submit contact form', 500, error);
    }
  });
  
  /**
   * Get all contact submissions (admin endpoint)
   * GET /api/contact/admin/all
   */
  getAllContacts = asyncHandler(async (req, res) => {
    try {
      // Note: In a real application, this would require admin authentication
      const filters = {
        status: req.query.status,
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: req.query.page,
        limit: req.query.limit
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });
      
      // Get contacts from service
      const result = await contactService.getAllContacts(filters);
      
      // Send successful response
      return sendSuccess(res, result, 'Contact submissions retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getAllContacts controller:', error);
      return sendError(res, 'Failed to retrieve contact submissions', 500, error);
    }
  });
  
  /**
   * Get contact by ID (admin endpoint)
   * GET /api/contact/admin/:id
   */
  getContactById = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return sendError(res, 'Contact ID is required', 400);
      }
      
      // Get contact from service
      const contact = await contactService.getContactById(id);
      
      if (!contact) {
        return sendNotFound(res, 'Contact submission');
      }
      
      // Send successful response
      return sendSuccess(res, contact, 'Contact submission retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getContactById controller:', error);
      return sendError(res, 'Failed to retrieve contact submission', 500, error);
    }
  });
  
  /**
   * Update contact status (admin endpoint)
   * PUT /api/contact/admin/:id/status
   */
  updateContactStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status, response } = req.body;
      
      if (!id) {
        return sendError(res, 'Contact ID is required', 400);
      }
      
      if (!status) {
        return sendError(res, 'Status is required', 400);
      }
      
      // Validate status
      const validStatuses = ['new', 'in-progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      
      // Update contact status using service
      const updatedContact = await contactService.updateContactStatus(id, status, response);
      
      if (!updatedContact) {
        return sendNotFound(res, 'Contact submission');
      }
      
      // Send successful response
      return sendSuccess(res, {
        id: updatedContact.id,
        status: updatedContact.status,
        response: updatedContact.response,
        processedAt: updatedContact.processedAt
      }, 'Contact status updated successfully');
      
    } catch (error) {
      logger.error('Error in updateContactStatus controller:', error);
      return sendError(res, 'Failed to update contact status', 500, error);
    }
  });
  
  /**
   * Get contact statistics (admin endpoint)
   * GET /api/contact/admin/stats
   */
  getContactStats = asyncHandler(async (req, res) => {
    try {
      // Get statistics from service
      const stats = await contactService.getContactStats();
      
      // Send successful response
      return sendSuccess(res, stats, 'Contact statistics retrieved successfully');
      
    } catch (error) {
      logger.error('Error in getContactStats controller:', error);
      return sendError(res, 'Failed to retrieve contact statistics', 500, error);
    }
  });
  
  /**
   * Health check for contact system
   * GET /api/contact/health
   */
  healthCheck = asyncHandler(async (req, res) => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        contactSystem: 'operational',
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      // Send successful response
      return sendSuccess(res, healthData, 'Contact system is healthy');
      
    } catch (error) {
      logger.error('Error in contact health check:', error);
      return sendError(res, 'Contact system health check failed', 500, error);
    }
  });
}

module.exports = new ContactController();