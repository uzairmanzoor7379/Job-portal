const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { protect } = require('./middleware/auth.middleware');

// Connect to database
connectDB();

const app = express();

// Issue #15 — add Helmet for comprehensive security headers
app.use(helmet());

// Issue #2 — restrict CORS to the known frontend origin; never use origin: true with credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// Issue #14 — pass COOKIE_SECRET so cookies are signed and their integrity is verifiable
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/api/queries', require('./routes/query.routes'));

// Issue #13 — protect the /uploads directory; unauthenticated users cannot download resumes
// Issue #12 is enforced at upload time (random filenames in upload.middleware.js)
app.use('/uploads', protect, express.static(path.join(__dirname, 'uploads')));

// Serve static files from public directory (for production build)
app.use(express.static(path.join(__dirname, './public')));

// SPA catch-all route - must be before error handler
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// Issue #10 / #11 — Custom Error Handler: hide stack traces based on NODE_ENV
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
