// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchSongs } = require('../controllers/searchController');

router.get('/', searchSongs);

module.exports = router;