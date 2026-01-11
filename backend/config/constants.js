// config/constants.js
const ITUNES_BASE = 'https://itunes.apple.com';

const ROUTES = {
  SEARCH: '/api/search',
  TRENDING: '/api/songs/trending',
  RECENT: '/api/songs/recent',
  RECOMMENDATIONS: '/api/songs/recommendations',
  SONG_INFO: '/api/player/info/:id',
  STREAM: '/api/player/stream/:id'
};

const DEFAULT_PARAMS = {
  SEARCH_LIMIT: 25,
  TRENDING_LIMIT: 20,
  RECENT_LIMIT: 15,
  RECOMMENDATIONS_LIMIT: 10,
  ALBUMS_TO_FETCH: 5,
  SONGS_PER_ALBUM: 5
};

module.exports = {
  ITUNES_BASE,
  ROUTES,
  DEFAULT_PARAMS
};
