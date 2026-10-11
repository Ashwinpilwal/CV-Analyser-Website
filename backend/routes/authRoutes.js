const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, demoLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/demo', demoLogin);
router.get('/me', protect, getMe);

module.exports = router;
