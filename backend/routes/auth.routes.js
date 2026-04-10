const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    updateUserProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Issue #8 — rate limit auth endpoints to block brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15-minute window
    max: 20,                     // max 20 attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('resume'), updateUserProfile);

module.exports = router;
