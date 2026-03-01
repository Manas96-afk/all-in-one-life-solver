const express = require('express');
const {
  analyzeDataset,
  saveReport,
  getReport,
  getUserReports,
  deleteReport,
  getAnalysisStats
} = require('../controllers/analysisController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/analyze', optionalAuth, analyzeDataset);
router.get('/report/:id', optionalAuth, getReport);

// Protected routes (authentication required)
router.use(protect); // All routes below require authentication

router.post('/report/save', saveReport);
router.get('/reports', getUserReports);
router.delete('/report/:id', deleteReport);
router.get('/stats', getAnalysisStats);

module.exports = router;