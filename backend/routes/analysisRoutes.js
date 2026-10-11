const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const {
  analyzeResume,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getDashboardStats,
  getSampleData,
} = require('../controllers/analysisController');

// Sample test data route
router.get('/sample', getSampleData);

// Main resume analysis route (supports file upload or raw text)
router.post('/analyze', optionalAuth, upload.single('resume'), analyzeResume);

// Authenticated user history and statistics
router.get('/history', protect, getUserAnalyses);
router.get('/stats', protect, getDashboardStats);

// Single record retrieval and deletion
router.get('/:id', optionalAuth, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
