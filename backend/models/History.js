const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  songId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  thumbnail: String,
  duration: String,
  playedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // You can track more metrics if you want
  playCount: {
    type: Number,
    default: 1
  },
  lastPlayedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
historySchema.index({ user: 1, playedAt: -1 });
historySchema.index({ user: 1, songId: 1 }, { unique: false });

module.exports = mongoose.model('History', historySchema);