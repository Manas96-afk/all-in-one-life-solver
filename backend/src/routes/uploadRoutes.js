const express = require('express');
const { uploadFile, getUploadStatus } = require('../controllers/uploadController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/', optionalAuth, uploadFile);
router.get('/status', getUploadStatus);

module.exports = router;