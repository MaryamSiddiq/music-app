// controllers/searchController.js
const axios = require('axios');
const { ITUNES_BASE, DEFAULT_PARAMS } = require('../config/constants');
const { cleanSongData } = require('../utils/formatters');

async function searchSongs(req, res) {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query required' 
      });
    }

    console.log('Searching iTunes for:', query);

    const response = await axios.get(`${ITUNES_BASE}/search`, {
      params: {
        term: query,
        media: 'music',
        entity: 'song',
        limit: DEFAULT_PARAMS.SEARCH_LIMIT
      }
    });

    const results = response.data.results
      .filter(track => track.kind === 'song' && track.previewUrl)
      .map(cleanSongData);
    
    console.log(`Found ${results.length} songs`);

    res.json({ 
      success: true, 
      results 
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed' 
    });
  }
}

module.exports = {
  searchSongs
};