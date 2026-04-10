const jwt = require('jsonwebtoken');
const User = require('../models/User.model');


// ─── Cookie helper ───────────────────────────────────────────────────────────
const COOKIE_OPTIONS = {
    httpOnly: true,
    signed: true,                                              // Issue #14 — signed cookie
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000,                         // 3 days
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// ─── Input validators ─────────────────────────────────────────────────────────
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Issue #7 — validate all fields before touching the database
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Issue #5 — only allow known roles; prevent privilege escalation
        const ALLOWED_ROLES = ['seeker', 'employer'];
        const role = ALLOWED_ROLES.includes(req.body.role) ? req.body.role : 'seeker';

        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email: email.toLowerCase().trim(), password, role });

        // Issue #3 — set httpOnly signed cookie; do NOT return token in body
        const token = generateToken(user._id);
        res.cookie('token', token, COOKIE_OPTIONS);

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                skills: user.skills,
                companyName: user.companyName,
                companyDescription: user.companyDescription,
                website: user.website,
                resume: user.resume,
                // token intentionally omitted — auth is via httpOnly cookie
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        // Issue #11 — never expose raw error.message to the client
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Issue #7 — validate inputs before querying the database
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user && (await user.matchPassword(password))) {
            // Issue #3 — set httpOnly signed cookie; do NOT return token in body
            const token = generateToken(user._id);
            res.cookie('token', token, COOKIE_OPTIONS);

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                skills: user.skills,
                companyName: user.companyName,
                companyDescription: user.companyDescription,
                website: user.website,
                resume: user.resume,
                
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Logout — clear the auth cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        signed: true,
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;
        user.bio = req.body.bio || user.bio;
        user.companyName = req.body.companyName || user.companyName;
        user.companyDescription = req.body.companyDescription || user.companyDescription;
        user.website = req.body.website || user.website;

        if (req.body.skills) {
            user.skills = req.body.skills.split(',').map(skill => skill.trim());
        }

        // Issue #7 — validate new password length before accepting it
        if (req.body.password) {
            if (req.body.password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters' });
            }
            user.password = req.body.password;
        }

        if (req.file) {
            user.resume = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        // Issue #3 — rotate the cookie on profile update (new token), still no token in body
        const token = generateToken(updatedUser._id);
        res.cookie('token', token, COOKIE_OPTIONS);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            location: updatedUser.location,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            companyName: updatedUser.companyName,
            companyDescription: updatedUser.companyDescription,
            website: updatedUser.website,
            resume: updatedUser.resume,
            // token intentionally omitted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    updateUserProfile,
};
