// backend/routes/jiosaavn.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Search songs on JioSaavn
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const response = await axios.get('https://saavn.dev/api/search/songs', {
      params: {
        query: query,
        page: page,
        limit: limit
      }
    });

    const songs = response.data.data.results.map(song => ({
      id: song.id,
      title: song.name,
      artist: song.primaryArtists || song.singers || 'Various Artists',
      album: song.album?.name || '',
      thumbnail: song.image?.[2]?.link || song.image?.[1]?.link || song.image?.[0]?.link,
      duration: formatDuration(song.duration),
      year: song.year,
      language: song.language,
      playUrl: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.mediaUrl,
      downloadUrl: song.downloadUrl?.[4]?.link // Highest quality MP3
    }));

    res.json({
      success: true,
      results: songs,
      total: response.data.data.total
    });
  } catch (error) {
    console.error('JioSaavn search error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search songs',
      details: error.message 
    });
  }
});

// Get song details by ID
router.get('/song/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`https://saavn.dev/api/songs/${id}`);
    
    const song = response.data.data[0];
    
    const songDetails = {
      id: song.id,
      title: song.name,
      artist: song.primaryArtists || song.singers || 'Various Artists',
      album: song.album?.name || '',
      thumbnail: song.image?.[2]?.link || song.image?.[1]?.link || song.image?.[0]?.link,
      duration: formatDuration(song.duration),
      year: song.year,
      language: song.language,
      playUrl: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.mediaUrl,
      downloadUrl: song.downloadUrl?.[4]?.link,
      lyrics: song.lyrics || '',
      copyright: song.copyright || '',
      hasLyrics: song.hasLyrics || false,
      explicitContent: song.explicitContent || false
    };
    
    res.json({
      success: true,
      data: songDetails
    });
  } catch (error) {
    console.error('JioSaavn song error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get song details',
      details: error.message 
    });
  }
});

// Get album songs
router.get('/album/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`https://saavn.dev/api/albums/${id}`);
    
    const album = response.data.data;
    
    const songs = album.songs.map(song => ({
      id: song.id,
      title: song.name,
      artist: song.primaryArtists || song.singers || 'Various Artists',
      thumbnail: song.image?.[2]?.link || song.image?.[1]?.link || song.image?.[0]?.link,
      duration: formatDuration(song.duration),
      playUrl: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.mediaUrl
    }));
    
    res.json({
      success: true,
      data: {
        id: album.id,
        name: album.name,
        year: album.year,
        playCount: album.playCount,
        language: album.language,
        artists: album.artists?.primary?.map(a => a.name) || [],
        songs: songs
      }
    });
  } catch (error) {
    console.error('JioSaavn album error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get album',
      details: error.message 
    });
  }
});

// Get trending songs
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get('https://saavn.dev/api/home');
    
    // Extract trending songs from homepage
    const trendingSections = response.data.data.trending || [];
    let trendingSongs = [];
    
    trendingSections.forEach(section => {
      if (section.songs && section.songs.length > 0) {
        trendingSongs = trendingSongs.concat(section.songs.map(song => ({
          id: song.id,
          title: song.name,
          artist: song.primaryArtists || song.singers || 'Various Artists',
          thumbnail: song.image?.[2]?.link || song.image?.[1]?.link || song.image?.[0]?.link,
          duration: formatDuration(song.duration),
          playUrl: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.mediaUrl
        })));
      }
    });
    
    // Limit to 20 songs
    trendingSongs = trendingSongs.slice(0, 20);
    
    res.json({
      success: true,
      data: trendingSongs
    });
  } catch (error) {
    console.error('JioSaavn trending error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get trending songs',
      details: error.message 
    });
  }
});

// Get playlist songs
router.get('/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`https://saavn.dev/api/playlists/${id}`);
    
    const playlist = response.data.data;
    
    const songs = playlist.songs.map(song => ({
      id: song.id,
      title: song.name,
      artist: song.primaryArtists || song.singers || 'Various Artists',
      thumbnail: song.image?.[2]?.link || song.image?.[1]?.link || song.image?.[0]?.link,
      duration: formatDuration(song.duration),
      playUrl: song.downloadUrl?.[4]?.link || song.downloadUrl?.[3]?.link || song.mediaUrl
    }));
    
    res.json({
      success: true,
      data: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        songCount: playlist.songCount,
        playCount: playlist.playCount,
        language: playlist.language,
        songs: songs
      }
    });
  } catch (error) {
    console.error('JioSaavn playlist error:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get playlist',
      details: error.message 
    });
  }
});

// Helper function to format duration
function formatDuration(seconds) {
  if (!seconds) return '3:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

module.exports = router;