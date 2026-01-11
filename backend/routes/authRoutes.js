const express = require('express');
const {
  signup,
  login,
  protect,
  getProfile
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile); // Protected route

module.exports = router;

