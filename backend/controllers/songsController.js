// controllers/songsController.js
const axios = require('axios');
const { ITUNES_BASE, DEFAULT_PARAMS } = require('../config/constants');
const { cleanSongData } = require('../utils/formatters');

async function getTrendingSongs(req, res) {
  try {
    console.log('Fetching top songs...');

    // Get top albums first
    const albumsResponse = await axios.get(
      `${ITUNES_BASE}/us/rss/topalbums/limit=10/json`
    );

    const albums = albumsResponse.data.feed.entry;
    const allSongs = [];

    // Get songs from each top album
    for (const album of albums.slice(0, DEFAULT_PARAMS.ALBUMS_TO_FETCH)) {
      const albumId = album.id.attributes['im:id'];
      
      try {
        const songsResponse = await axios.get(`${ITUNES_BASE}/lookup`, {
          params: {
            id: albumId,
            entity: 'song',
            limit: DEFAULT_PARAMS.SONGS_PER_ALBUM
          }
        });

        const songs = songsResponse.data.results
          .filter(item => item.kind === 'song' && item.previewUrl)
          .map(cleanSongData);
        
        allSongs.push(...songs);
      } catch (err) {
        console.error('Error fetching album songs:', err.message);
      }
    }

    console.log(`Fetched ${allSongs.length} trending songs`);

    res.json({ 
      success: true,
      songs: allSongs.slice(0, DEFAULT_PARAMS.TRENDING_LIMIT)
    });
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trending songs' 
    });
  }
}

async function getRecentSongs(req, res) {
  try {
    console.log('Fetching new releases...');

    const response = await axios.get(
      `${ITUNES_BASE}/us/rss/topsongs/limit=20/json`
    );

    const entries = response.data.feed.entry;
    const songs = [];

    for (const entry of entries) {
      const songId = entry.id.attributes['im:id'];
      
      try {
        const detailResponse = await axios.get(`${ITUNES_BASE}/lookup`, {
          params: { id: songId }
        });

        const track = detailResponse.data.results.find(r => r.kind === 'song');
        if (track && track.previewUrl) {
          songs.push(cleanSongData(track));
        }
      } catch (err) {
        console.error('Error fetching song details:', err.message);
      }
    }

    console.log(`Fetched ${songs.length} new releases`);

    res.json({ 
      success: true,
      songs: songs.slice(0, DEFAULT_PARAMS.RECENT_LIMIT)
    });
  } catch (error) {
    console.error('Recent songs error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent songs' 
    });
  }
}

async function getRecommendations(req, res) {
  try {
    console.log('Fetching recommendations...');

    // Use top songs as recommendations
    const response = await axios.get(
      `${ITUNES_BASE}/us/rss/topsongs/limit=20/json`
    );

    const entries = response.data.feed.entry;
    const songs = [];

    for (const entry of entries.slice(0, DEFAULT_PARAMS.RECOMMENDATIONS_LIMIT)) {
      const songId = entry.id.attributes['im:id'];
      
      try {
        const detailResponse = await axios.get(`${ITUNES_BASE}/lookup`, {
          params: { id: songId }
        });

        const track = detailResponse.data.results.find(r => r.kind === 'song');
        if (track && track.previewUrl) {
          songs.push(cleanSongData(track));
        }
      } catch (err) {
        console.error('Error fetching song:', err.message);
      }
    }

    res.json({ 
      success: true,
      songs 
    });
  } catch (error) {
    console.error('Recommendations error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recommendations' 
    });
  }
}

module.exports = {
  getTrendingSongs,
  getRecentSongs,
  getRecommendations
};