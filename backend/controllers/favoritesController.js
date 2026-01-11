// controllers/favoritesController.js
const Favorite = require('../models/Favorite');

// @desc    Add song to favorites
// @route   POST /api/favorites/add
// @access  Private
exports.addToFavorites = async (req, res, next) => {
  try {
    const { songId, title, artist, thumbnail, duration } = req.body;
    
    if (!songId || !title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Song ID, title and artist are required'
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      songId,
      title,
      artist,
      thumbnail: thumbnail || '',
      duration: duration || '3:00'
    });

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Song already in favorites'
      });
    }
    next(error);
  }
};

// @desc    Remove song from favorites
// @route   DELETE /api/favorites/remove/:songId
// @access  Private
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      songId: songId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .sort({ addedAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if song is in favorites
// @route   GET /api/favorites/check/:songId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const favorite = await Favorite.findOne({
      user: req.user.id,
      songId: songId
    });

    res.status(200).json({
      success: true,
      data: {
        isFavorite: !!favorite,
        songId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites count
// @route   GET /api/favorites/count
// @access  Private
exports.getFavoritesCount = async (req, res, next) => {
  try {
    const count = await Favorite.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all favorites
// @route   DELETE /api/favorites/clear
// @access  Private
exports.clearFavorites = async (req, res, next) => {
  try {
    await Favorite.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All favorites cleared',
      data: {
        count: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;