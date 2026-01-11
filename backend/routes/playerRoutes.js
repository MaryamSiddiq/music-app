// routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSongInfo,
  getStreamUrl
} = require('../controllers/playerController');

router.get('/info/:id', getSongInfo);
router.get('/stream/:id', getStreamUrl);

module.exports = router;