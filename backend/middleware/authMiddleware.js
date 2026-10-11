const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memStore = require('../services/storageFallback');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_curator_cv_2026_secure';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const protect = async (req, res, next) => {
  let token;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies.auracv_session) {
    token = req.cookies.auracv_session;
  }
  // 2. Check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = await memStore.findUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User account not found.' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no session cookie or token provided.' });
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.auracv_session) {
    token = req.cookies.auracv_session;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = await memStore.findUserById(decoded.id);
      }
    } catch (_) {
      // Allow request to proceed anonymously if token is invalid
      req.user = null;
    }
  }
  next();
};

module.exports = {
  protect,
  optionalAuth,
  generateToken,
};
