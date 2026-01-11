const History = require('../models/History');

// @desc    Record song play
// @route   POST /api/history/record
// @access  Private

exports.recordPlay = async (req, res, next) => {
  try {
    const { songId, title, artist, thumbnail, duration } = req.body;
    
    if (!songId || !title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Song ID, title and artist are required'
      });
    }

    console.log('🎵 Recording play for user:', req.user.id, 'song:', songId);

    // Use findOneAndUpdate with upsert for atomic operation
    const result = await History.findOneAndUpdate(
      {
        user: req.user.id,
        songId: songId
      },
      {
        $set: {
          title: title,
          artist: artist,
          thumbnail: thumbnail || '',
          duration: duration || '3:00',
          lastPlayedAt: new Date()
        },
        $inc: { playCount: 1 },
        $setOnInsert: {
          playedAt: new Date()
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    console.log('   History updated:', result._id);

    // Send immediate response
    res.status(200).json({
      success: true,
      message: 'Play recorded',
      data: result
    });

    // Cleanup old records in background (don't wait for it)
    setTimeout(async () => {
      try {
        const count = await History.countDocuments({ user: req.user.id });
        if (count > 1000) {
          const records = await History.find({ user: req.user.id })
            .sort({ playedAt: -1 })
            .skip(1000)
            .select('_id');
          
          if (records.length > 0) {
            const ids = records.map(r => r._id);
            await History.deleteMany({ _id: { $in: ids } });
            console.log(`🧹 Cleaned up ${records.length} old history records`);
          }
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }, 1000); // Run cleanup 1 second later

  } catch (error) {
    console.error('❌ Record play error:', error);
    next(error);
  }
};
// @desc    Get user's listening history
// @route   GET /api/history
// @access  Private
// @desc    Get user's listening history
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log(`📊 Getting history for user ${req.user.id}, page ${page}`);

    // Use lean() for faster queries (returns plain JS objects)
    const [history, total] = await Promise.all([
      History.find({ user: req.user.id })
        .sort({ lastPlayedAt: -1 }) // Use lastPlayedAt for better sorting
        .skip(skip)
        .limit(limit)
        .lean(), // Convert to plain JS objects (faster)
      History.countDocuments({ user: req.user.id })
    ]);

    console.log(`   Found ${history.length} history items`);

    res.status(200).json({
      success: true,
      data: {
        history,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Get history error:', error);
    next(error);
  }
};
// @desc    Get recently played songs
// @route   GET /api/history/recent
// @access  Private
exports.getRecentPlays = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recent = await History.find({ user: req.user.id })
      .sort({ lastPlayedAt: -1 })
      .limit(limit)
      .select('songId title artist thumbnail duration lastPlayedAt playCount');

    res.status(200).json({
      success: true,
      data: recent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most played songs
// @route   GET /api/history/most-played
// @access  Private
exports.getMostPlayed = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const mostPlayed = await History.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $group: {
          _id: '$songId',
          title: { $first: '$title' },
          artist: { $first: '$artist' },
          thumbnail: { $first: '$thumbnail' },
          duration: { $first: '$duration' },
          totalPlays: { $sum: '$playCount' },
          lastPlayedAt: { $max: '$lastPlayedAt' }
      }},
      { $sort: { totalPlays: -1, lastPlayedAt: -1 } },
      { $limit: limit },
      { $project: {
          songId: '$_id',
          title: 1,
          artist: 1,
          thumbnail: 1,
          duration: 1,
          totalPlays: 1,
          lastPlayedAt: 1
      }}
    ]);

    res.status(200).json({
      success: true,
      data: mostPlayed
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear history
// @route   DELETE /api/history/clear
// @access  Private
exports.clearHistory = async (req, res, next) => {
  try {
    await History.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'History cleared',
      data: { count: 0 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove specific item from history
// @route   DELETE /api/history/remove/:songId
// @access  Private
exports.removeFromHistory = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    const result = await History.deleteMany({
      user: req.user.id,
      songId: songId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'History item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from history',
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get history stats
// @route   GET /api/history/stats
// @access  Private
exports.getHistoryStats = async (req, res, next) => {
  try {
    const [totalPlays, uniqueSongs, mostPlayedSong, historyCount] = await Promise.all([
      // Total play count
      History.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: null, total: { $sum: '$playCount' } } }
      ]),
      // Unique songs count
      History.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$songId' } },
        { $count: 'uniqueSongs' }
      ]),
      // Most played song
      History.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $group: {
            _id: '$songId',
            title: { $first: '$title' },
            artist: { $first: '$artist' },
            totalPlays: { $sum: '$playCount' }
        }},
        { $sort: { totalPlays: -1 } },
        { $limit: 1 }
      ]),
      // Total history entries
      History.countDocuments({ user: req.user.id })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPlays: totalPlays[0]?.total || 0,
        uniqueSongs: uniqueSongs[0]?.uniqueSongs || 0,
        totalEntries: historyCount,
        mostPlayed: mostPlayedSong[0] || null,
        last30Days: 0 // You can add more stats as needed
      }
    });
  } catch (error) {
    next(error);
  }
};