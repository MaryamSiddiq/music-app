const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const historyController = require('../controllers/historyController');

// All routes require authentication
router.use(protect);

// Record a play
router.post('/record', historyController.recordPlay);

// Get history
router.get('/', historyController.getHistory);

// Get recent plays
router.get('/recent', historyController.getRecentPlays);

// Get most played songs
router.get('/most-played', historyController.getMostPlayed);

// Get history stats
router.get('/stats', historyController.getHistoryStats);

// Remove from history
router.delete('/remove/:songId', historyController.removeFromHistory);

// Clear history
router.delete('/clear', historyController.clearHistory);

module.exports = router;