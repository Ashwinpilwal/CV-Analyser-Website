const mongoose = require('mongoose');
const User = require('../models/User');
const memStore = require('../services/storageFallback');
const { generateToken } = require('../middleware/authMiddleware');

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' is required for cross-domain cookies (Vercel frontend -> Render backend)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    // Check if user already exists
    let userExists = false;
    if (isMongoConnected) {
      userExists = await User.findOne({ email: email.toLowerCase() });
    } else {
      userExists = await memStore.findUserByEmail(email);
    }

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    let user;
    if (isMongoConnected) {
      user = await User.create({
        name,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      });
    } else {
      user = await memStore.createUser({ name, email, password });
    }

    const token = generateToken(user._id);

    // Send HTTP-only secure cookie
    res.cookie('auracv_session', token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while registering account.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password.',
      });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;
    let user;

    if (isMongoConnected) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } else {
      user = await memStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    // Send HTTP-only secure cookie
    res.cookie('auracv_session', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while logging in.',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

// @desc    Logout user and clear session cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.clearCookie('auracv_session', getCookieOptions());
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// @desc    Fast Demo Login for previewing authenticated dashboard
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo@auracv.ai';
    const isMongoConnected = mongoose.connection.readyState === 1;
    let user;

    if (isMongoConnected) {
      user = await User.findOne({ email: demoEmail });
      if (!user) {
        user = await User.create({
          name: 'Elena Rostova',
          email: demoEmail,
          password: 'demoPassword123',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        });
      }
    } else {
      user = await memStore.findUserByEmail(demoEmail);
      if (!user) {
        user = await memStore.createUser({
          name: 'Elena Rostova',
          email: demoEmail,
          password: 'demoPassword123',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        });
      }
    }

    const token = generateToken(user._id);

    // Send HTTP-only secure cookie
    res.cookie('auracv_session', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Demo session authenticated.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not create demo session.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  demoLogin,
};
