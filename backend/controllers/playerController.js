// controllers/playerController.js
const axios = require('axios');
const { ITUNES_BASE } = require('../config/constants');
const { cleanSongData, formatStreamResponse } = require('../utils/formatters');

async function getSongInfo(req, res) {
  try {
    const { id } = req.params;
    console.log('Getting song info for ID:', id);
    
    const response = await axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id }
    });

    const track = response.data.results.find(r => r.kind === 'song');
    
    if (!track) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const song = cleanSongData(track);
    console.log('Song info retrieved:', song.title);
    
    res.json(song);
  } catch (error) {
    console.error('Song info error:', error.message);
    res.status(500).json({ error: 'Failed to get song info' });
  }
}

async function getStreamUrl(req, res) {
  try {
    const { id } = req.params;
    console.log('Getting stream URL for ID:', id);
    
    const response = await axios.get(`${ITUNES_BASE}/lookup`, {
      params: { id }
    });

    const track = response.data.results.find(r => r.kind === 'song');
    
    if (!track || !track.previewUrl) {
      return res.status(404).json({ 
        success: false,
        error: 'Preview not available' 
      });
    }

    console.log('   Stream URL obtained');

    res.json(formatStreamResponse(track));
  } catch (error) {
    console.error('Stream error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get stream URL' 
    });
  }
}

module.exports = {
  getSongInfo,
  getStreamUrl
};