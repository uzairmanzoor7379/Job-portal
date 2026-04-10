const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
    let token;

    // Issue #5 (partial) / Issue #14 — prefer signed httpOnly cookie; fall back to Bearer
    if (req.signedCookies && req.signedCookies.token) {
        token = req.signedCookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            next();
        } catch (error) {
            // Issue #11 — do not expose error.message in auth failures
            return res.status(401).json({ message: 'Not authorized, token invalid' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const optionalProtect = async (req, res, next) => {
    let token;
    if (req.signedCookies && req.signedCookies.token) {
        token = req.signedCookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Silently failure for optional auth
        }
    }
    next();
};

module.exports = { protect, optionalProtect };
