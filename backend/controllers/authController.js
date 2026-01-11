const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');


// Validation helper
// Validation helper (make sure it matches)
const validateSignup = (data) => {
  const errors = {};
  
  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please provide a valid email';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log('Signup attempt:', { username, email });

    // Validate input
    const validation = validateSignup(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if user already exists (REMOVE contact from query)
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    console.log('User exists check result:', userExists);
    
    if (userExists) {
      let message = 'User already exists';
      if (userExists.email === email) {
        message = 'Email already registered';
      } else if (userExists.username === username) {
        message = 'Username already taken';
      }
      
      console.log('User exists with message:', message);
      return res.status(400).json({
        success: false,
        message
      });
    }

    console.log('Creating new user...');
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });
    
    console.log('User created:', user._id);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token
      }
    });
  } catch (error) {
    console.error('Signup error details:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      console.log('Duplicate key error:', error.keyPattern);
      const field = Object.keys(error.keyPattern)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      
      return res.status(400).json({
        success: false,
        message
      });
    }
    
    // Pass to error handler middleware for other errors
    next(error);
  }
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};



// controllers/authController.js

// ... your signup and login functions ...

// @desc    Protect routes (authentication middleware)
// @access  Private
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (requires token)
exports.getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by protect middleware
    const user = req.user;
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          // Add other fields if your User model has them
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Make sure you have module.exports at the end
module.exports = {
  signup: exports.signup,
  login: exports.login,
  protect: exports.protect,
  getProfile: exports.getProfile
};