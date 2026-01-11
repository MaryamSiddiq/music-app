// routes/favoritesRoutes.js
const express = require('express');
const router = express.Router();

// Import auth middleware - check the correct path
const { protect } = require('../controllers/authController');

// Import favorites controller
const favoritesController = require('../controllers/favoritesController');

// All routes require authentication
router.use(protect);

// Routes
router.post('/add', favoritesController.addToFavorites);
router.delete('/remove/:songId', favoritesController.removeFromFavorites);
router.get('/', favoritesController.getFavorites);
router.get('/check/:songId', favoritesController.checkFavorite);
router.get('/count', favoritesController.getFavoritesCount);
router.delete('/clear', favoritesController.clearFavorites);

module.exports = router;