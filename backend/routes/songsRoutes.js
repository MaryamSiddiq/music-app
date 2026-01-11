// routes/songsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTrendingSongs,
  getRecentSongs,
  getRecommendations
} = require('../controllers/songsController');

router.get('/trending', getTrendingSongs);
router.get('/recent', getRecentSongs);
router.get('/recommendations', getRecommendations);

module.exports = router;