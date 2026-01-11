// index.js - Main Server File
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const songsRoutes = require('./routes/songsRoutes');
const playerRoutes = require('./routes/playerRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const historyRoutes = require('./routes/historyRoutes'); // Add this

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

connectDB();
// index.js - Update CORS middlewar

// Use this CORS configuration instead
app.use(cors({
  origin: ['http://localhost:19006', 'http://localhost:19000', 'exp://*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Or for development, allow everything (less secure but works):
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/favorite', favoritesRoutes);
app.use('/api/history', historyRoutes); // Add this

// app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'iTunes Music Backend is running',
    service: 'iTunes/Apple Music API',
    features: [
      'International music',
      'No API key needed',
      '30-second previews',
      'High quality audio',
      'Top charts',
      'New releases'
    ]
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'iTunes Music API Backend',
    version: '1.1.0',
    features: {
      auth: '  ',
      favorites: '  ',
      search: '  ',
      player: '  '
    },
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login'
      },
      favorites: {
        add: 'POST /api/favorites/add',
        remove: 'DELETE /api/favorites/remove/:songId',
        list: 'GET /api/favorites',
        check: 'GET /api/favorites/check/:songId',
        count: 'GET /api/favorites/count',
        clear: 'DELETE /api/favorites/clear'
      },
      music: {
        search: 'GET /api/search?query=your_query',
        trending: 'GET /api/songs/trending',
        recent: 'GET /api/songs/recent',
        recommendations: 'GET /api/songs/recommendations',
        song_info: 'GET /api/player/info/:id',
        stream_url: 'GET /api/player/stream/:id'
      }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎵 iTunes Music Backend`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Network: http://10.114.110.112:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`\n   International music ready!\n`);
});